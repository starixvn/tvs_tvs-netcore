using AutoMapper;
using MediatR;
using SpecialDelete.VoidByBetId.Constants;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Handlers;

public class VoidTicketsRequest : VoidTicketsQuery, IRequest<List<Result>>
{
}

public class VoidTicketsHandler : IRequestHandler<VoidTicketsRequest, List<Result>>
{
    private readonly IMapper mapper;
    private readonly NetPositionService netPositionService;
    private readonly HandleService handleService;
    private readonly LoggingService loggingService;
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly ResultCacheService resultCacheService;
    private readonly CashOutApiService cashOutApiService;

    public VoidTicketsHandler(IMapper mapper,
        NetPositionService netPositionService,
        HandleService handleService,
        LoggingService loggingService,
        NotificationLetstalkService notificationLetstalkService,
        ResultCacheService resultCacheService,
        CashOutApiService cashOutApiService)
    {
        this.mapper = mapper;
        this.netPositionService = netPositionService;
        this.handleService = handleService;
        this.loggingService = loggingService;
        this.notificationLetstalkService = notificationLetstalkService;
        this.resultCacheService = resultCacheService;
        this.cashOutApiService = cashOutApiService;
    }

    public async Task<List<Result>> Handle(VoidTicketsRequest request, CancellationToken cancellationToken)
    {
        if (await resultCacheService.IsExistResult(request.Guid))
        {
            return null;
        }

        var results = new List<Result>();
        await resultCacheService.SetVoidResultsCache(request.Guid, results);

        var warningCrickets = string.Empty;
        var callNetPosition = await netPositionService.UpdateNetPosition(request.TransIdCrickets, NetPositionConstant.ActionVoid);
        if (!callNetPosition)
        {
            warningCrickets = Helper.MessageFailApiCricket(request.TransIdCrickets, NetPositionConstant.ActionVoid);
            request.Tickets = request.Tickets.Where(x => request.TransIdCrickets.All(y => y.TransId != x.TransId));
        }

        if (!request.Tickets.Any())
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = warningCrickets });
        }
        else
        {
            results = await ResultsVoidTicket(request, warningCrickets);
        }

        await resultCacheService.SetVoidResultsCache(request.Guid, results);

        return results;
    }

    private async Task<List<Result>> ResultsVoidTicket(VoidTicketsQuery query, string warningCrickets)
    {
        var results = new List<Result>();
        var model = await handleService.VoidTickets(query);
        results.AddRange(await HandlerVoidedTickets(query, model, warningCrickets));
        results.AddRange(await CheckVoidTicketsFail(model));

        return results;
    }

    private async Task<IEnumerable<Result>> HandlerVoidedTickets(VoidTicketsQuery query, VoidTicketsModel model, string warningCrickets)
    {
        var results = new List<Result>();
        if (!(model.Tickets?.Count() > 0))
        {
            return Enumerable.Empty<Result>();
        }

        results.AddRange(await ContactUser(query, model, warningCrickets));
        await cashOutApiService.VoidBetForCashOutBasketball(model.Tickets);

        return results;
    }

    private async Task<IEnumerable<Result>> CheckVoidTicketsFail(VoidTicketsModel model)
    {
        var results = new List<Result>();
        if (model.Validation.IsSuccessful)
        {
            return Enumerable.Empty<Result>();
        }

        results.Add(new Result { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg });
        await netPositionService.RollBackNetPosition(model.TicketsRollbackNetPosition);

        return results;
    }

    private async Task<IEnumerable<Result>> ContactUser(VoidTicketsQuery query, VoidTicketsModel model, string warningCrickets)
    {
        var results = new List<Result>();
        try
        {
            results.AddRange(handleService.CreateWarningMessage(warningCrickets));
            await ContactUser(query, model, results);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            results.Clear();
            results.Add(new Result { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private async Task ContactUser(VoidTicketsQuery query, VoidTicketsModel model, List<Result> results)
    {
        if (model.Tickets.Any())
        {
            await handleService.SendMessage(query, model.Tickets);
            results.AddRange(await handleService.SendEmail(query, model.Tickets.ToList()));
            results.AddRange(await SendLetstalk(query, model));
        }
    }

    private async Task<IEnumerable<Result>> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        var infoForLetstalk = mapper.Map<TicketInfoForLetstalk>(query);
        if (query.IsFilterByBetId)
        {
            if (query.Match != null)
            {
                results.AddRange(await notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, model.Tickets));
            }
            else
            {
                infoForLetstalk.IsCheckMainParlay = true;
                results.AddRange(await SendLetstalkWithMultiMessage(model.Tickets, infoForLetstalk));
            }
        }
        else
        {
            infoForLetstalk.IsCheckMainParlay = true;
            infoForLetstalk.IsMemberTemplate = true;
            results.AddRange(await notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, model.Tickets));
        }

        return results;
    }

    private async Task<IEnumerable<Result>> SendLetstalkWithMultiMessage(IEnumerable<TicketEmailModel> tickets, TicketInfoForLetstalk infoForLetstalk)
    {
        var results = new List<Result>();
        var ticketsList = tickets.Where(item => !item.BetTypeId.IsParlay() && !item.BetTypeId.IsSabaPromotion());
        if (!ticketsList.Any())
        {
            return results;
        }

        await SendLetstalkWithGroupNormalTickets(ticketsList, infoForLetstalk, results);
        await SendLetstalkWithGroupVirtualSportsTickets(ticketsList, infoForLetstalk, results);

        return results;
    }

    private async Task SendLetstalkWithGroupNormalTickets(IEnumerable<TicketEmailModel> ticketsList, TicketInfoForLetstalk infoForLetstalk, List<Result> results)
    {
        var groupTickets = ticketsList.Where(t => !BetTypeConstant.VirtualSports.Contains(t.BetTypeId))
            .GroupBy(b => b.ParentMatchId).Select(ticket => new GroupVoidTicketsModel
            {
                GroupName = ticket.Key.Value,
                Tickets = ticket.ToList(),
                Type = ticket.Any(t => t.BetTypeId.IsOutright()) ? MatchInfoTypeConstant.Outright : MatchInfoTypeConstant.Normal
            });
        if (groupTickets.Any())
        {
            await SendLetstalkWithGroupTickets(infoForLetstalk, groupTickets, results);
        }
    }

    private async Task SendLetstalkWithGroupVirtualSportsTickets(IEnumerable<TicketEmailModel> ticketsList, TicketInfoForLetstalk infoForLetstalk, List<Result> results)
    {
        var groupVirtualSportTickets = ticketsList.Where(t => BetTypeConstant.VirtualSports.Contains(t.BetTypeId))
            .GroupBy(b => b.OddsId).Select(ticket => new GroupVoidTicketsModel
            {
                GroupName = ticket.Key.Value,
                Tickets = ticket.ToList(),
                Type = MatchInfoTypeConstant.VirtualSportOrHorseRacing
            });
        if (groupVirtualSportTickets.Any())
        {
            await SendLetstalkWithGroupTickets(infoForLetstalk, groupVirtualSportTickets, results);
        }
    }

    private async Task SendLetstalkWithGroupTickets(TicketInfoForLetstalk infoForLetstalk, IEnumerable<GroupVoidTicketsModel> groupTickets, List<Result> results)
    {
        foreach (var group in groupTickets)
        {
            infoForLetstalk.Match = await handleService.GetMatchInfo(group.GroupName, group.Type);
            if (infoForLetstalk.Match != null)
            {
                results.AddRange(await notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, group.Tickets));
            }
        }
    }
}