using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestService
{
    Task<Result> Execute(AddRequestQuery query);
}

public class AddRequestServiceImp : AddRequestService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly SendLetstalkAfterAddService sendLetstalkAfterAddService;

    public AddRequestServiceImp(IMapper mapper, //NOSONAR
        IDynamicRepository repository,
        SessionService sessionService,
        LoggingService loggingService,
        MarkTicketsWhenAddEditService marketTicketsWhenEditService,
        AccountWinLostService accountWinLostService,
        InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService,
        SendLetstalkAfterAddService sendLetstalkAfterAddService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.marketTicketsWhenEditService = marketTicketsWhenEditService;
        this.accountWinLostService = accountWinLostService;
        this.insertAutoVoidRequestQueueService = insertAutoVoidRequestQueueService;
        this.sendLetstalkAfterAddService = sendLetstalkAfterAddService;
    }

    public async Task<Result> Execute(AddRequestQuery query)
    {
        try
        {
            var markTicketResults = Enumerable.Empty<Result>();
            if (!query.IssueTypeId.IsArchivedTicket())
            {
                markTicketResults = (await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds)).ToList();
            }

            return markTicketResults.All(x => x.IsSuccessful)
                ? await ExecuteAddAfterMarkTickets(query)
                : markTicketResults.First(x => !x.IsSuccessful);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message,
            };
        }
    }

    private async Task<Result> ExecuteAddAfterMarkTickets(AddRequestQuery query)
    {
        var requestId = await ExecuteAddRequest(query);
        await insertAutoVoidRequestQueueService.Execute(requestId, query.ActionId, query.EarlyKickOffInfo);
        await sendLetstalkAfterAddService.Execute(query, requestId);
        return new Result
        {
            Data = new AddRequestResultData
            {
                RequestId = requestId,
                MatchId = GetMatchIdAfterAddRequest(query)
            }
        };
    }

    private async Task<int> ExecuteAddRequest(AddRequestQuery query)  // NOSONAR
    {
        var command = mapper.Map<AddRequestCommand>(query);
        command.Operators = query.OperatorsList?.OperatorToXml();
        command.UserId = sessionService.UserId;
        command.IP = sessionService.GetClientIp();
        command.TransInfoJson = query.TransInfoJson;
        command.WrongScoreInfo = query.WrongScoreInfo?.ToEventWrongScoreXml();
        command.WrongHdpInfo = query.WrongHdpInfo?.ToEventWrongHdpXml();
        command.Wrong1stHdpInfo = query.Wrong1stHdpInfo?.ToEventWrongHdpXml();
        command.WrongOuInfo = query.WrongOuInfo?.ToEventWrongOuXml();
        command.Wrong1stOuInfo = query.Wrong1stOuInfo?.ToEventWrongOuXml();
        command.WrongOddsInfo = query.WrongOddsInfo?.ToEventWrongOddsXml();
        command.ReducedOverInfo = query.ReducedOverInfo?.ToEventReducedOverXml();
        command.NotParticipateInfo = query.NotParticipateInfo?.ToEventNotParticipateXml();
        command.DangerAcceptedInfo = query.DangerAcceptedInfo?.ToEventDangerAcceptedXml();
        command.RedCardInfo = query.RedCardInfo?.ToEventDangerAcceptedXml();
        command.AbnormalAccountInfo = query.AbnormalAccountInfo?.ToAbnormalAccountXml();
        command.DuplicateTicketsInfo = query.DuplicateTicketsInfo?.ToDuplicateTicketsXml();
        command.RecoverTicketInfo = query.RecoverTicketInfo?.ToEventRecoverTicketXml();
        command.KickOffInfo = query.EarlyKickOffInfo?.ToEventKickOffXml();

        await repository.ExecuteAsync(command);
        if (query.IssueTypeId.IsAbnormalAccount() && query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            await accountWinLostService.SaveAccountWinLost(command.RequestId, query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
        }

        return command.RequestId;
    }

    private static string GetMatchIdAfterAddRequest(AddRequestQuery query) // NOSONAR
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.DangerAccepted => string.Join(", ", query.DangerAcceptedInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongHDP => string.Join(", ", query.WrongHdpInfo.Select(x => x.MatchId)),
            IssueTypeConstant.Wrong1stHDP => string.Join(", ", query.Wrong1stHdpInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongOU => string.Join(", ", query.WrongOuInfo.Select(x => x.MatchId)),
            IssueTypeConstant.Wrong1stOU => string.Join(", ", query.Wrong1stOuInfo.Select(x => x.MatchId)),
            IssueTypeConstant.RedCard => string.Join(", ", query.RedCardInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongOdds => string.Join(", ", query.WrongOddsInfo.Select(x => x.MatchId)),
            IssueTypeConstant.ReducedOver => query.ReducedOverInfo.First().MatchId.ToString(),
            IssueTypeConstant.NotParticipate => query.NotParticipateInfo.First().MatchId.ToString(),
            IssueTypeConstant.WrongScore => query.WrongScoreInfo.First().MatchId.ToString(),
            IssueTypeConstant.EarlyKickOffTime => string.Join(", ", query.EarlyKickOffInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongKickOffTime => string.Join(", ", query.EarlyKickOffInfo.Select(x => x.MatchId)),
            IssueTypeConstant.AbnormalBetRealMember => query.MatchId.ToString(),
            IssueTypeConstant.AbnormalBet => query.MatchId.ToString(),
            IssueTypeConstant.DuplicateTickets => query.DuplicateTicketsInfo?.MatchId.ToString(),
            _ => string.Empty
        };
    }
}