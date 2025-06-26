using AutoMapper;
using SpecialDelete.VoidByBetId.Constants;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;

namespace SpecialDelete.VoidByBetId.Services.VoidTickets;

public interface LetstalkService
{
    Task<IEnumerable<Result>> Send(VoidTicketsQuery query, VoidTicketsModel model);
}

public class LetstalkServiceImp(
    IMapper mapper,
    MatchService matchService,
    NotificationLetstalkService notificationLetstalkService)
    : LetstalkService
{
    public async Task<IEnumerable<Result>> Send(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var results = new List<Result>();
        var infoForLetstalk = mapper.Map<TicketInfoForLetstalk>(query);
        if (query.Match != null)
        {
            results.AddRange(await notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, model.Tickets));
        }
        else
        {
            infoForLetstalk.IsCheckMainParlay = true;
            results.AddRange(await SendLetstalkWithMultiMessage(model.Tickets, infoForLetstalk));
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
                GroupName = ticket.Key!.Value,
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
                GroupName = ticket.Key!.Value,
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
            infoForLetstalk.Match = await GetMatchInfo(group.GroupName, group.Type);
            if (infoForLetstalk.Match != null)
            {
                results.AddRange(await notificationLetstalkService.SendToGroupVoidSettledBets(infoForLetstalk, group.Tickets));
            }
        }
    }

    private async Task<Match> GetMatchInfo(int matchId, int type)
    {
        var criteria = new GetMatchInfoCriteria
        {
            MatchId = matchId,
            Type = type
        };
        var match = await matchService.GetMatch(criteria);
        match = matchService.UpdateMatchInfoFromRemotingRef(match);
        return match;
    }
}