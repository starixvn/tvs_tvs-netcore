using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;
using SpecialDelete.CashOutTransaction.Common.Extensions;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using SpecialDelete.CashOutTransaction.Common.Services;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services;

public interface DisplayUiService
{
    Task<GetTicketsModel> ExecuteQuery(GetTicketsQuery query);

    GetTicketsVoidCashOutCriteria CreateCriteria(GetTicketsQuery query);

    List<GetTicketModel> Paging(List<GetTicketModel> tickets, int index, int size);

    List<Group<GetTicketModel>> Groups(List<GetTicketModel> tickets);

    Task<Group<TicketViewModel>> Assign(Group<GetTicketModel> groupTickets);
}

public class DisplayUiServiceImp(
    Repository repository,
    SessionService sessionService,
    TicketHtmlService ticketHtmlService)
    : DisplayUiService
{
    public async Task<GetTicketsModel> ExecuteQuery(GetTicketsQuery query)
    {
        var criteria = CreateCriteria(query);
        return await repository.GetTicketsVoidCashOut(criteria);
    }

    public GetTicketsVoidCashOutCriteria CreateCriteria(GetTicketsQuery query)
    {
        return new GetTicketsVoidCashOutCriteria
        {
            MatchId = query.MatchId,
            TransIds = query.TransIds,
            FilterBy = query.FilterBy,
            Duration = query.Durations.ToXml()
        };
    }

    public List<GetTicketModel> Paging(List<GetTicketModel> tickets, int index, int size)
    {
        var skip = index * size;
        return tickets.Skip(skip).Take(size).ToList();
    }

    public List<Group<GetTicketModel>> Groups(List<GetTicketModel> tickets)
    {
        var groups = tickets.GroupBy(ticket => ticket.GroupName);
        return groups.Select(group => new Group<GetTicketModel>
        {
            Name = group.Key,
            Tickets = group.Select(ticket => ticket).ToList()
        }).ToList();
    }

    public async Task<Group<TicketViewModel>> Assign(Group<GetTicketModel> groupTickets)
    {
        var permission = new UserPermission
        {
            SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host),
            UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host)
        };
        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in groupTickets.Tickets)
        {
            var ticketDetail = ticketHtmlService.GetTicket(item, permission);
            var ticket = new TicketViewModel
            {
                No = index++,
                BetId = item.TransId.ToString(),
                Player = item.UserName,
                TransDate = ticketDetail.TransDate,
                Odds = ticketDetail.Odds,
                Stake = ticketDetail.Stake,
                WinLoss = ticketDetail.WinLoss,
                Status = ticketDetail.Status,
                Score = ticketDetail.Score,
                Handicap = ticketDetail.Handicap,
                Choice = ticketDetail.Choice,
                IsDisable = ticketDetail.IsDisable,
                MatchId = item.MatchId,
                SiteDbGroupId = item.SiteDbGroupId
            };
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = groupTickets.Name, Tickets = tickets };
    }
}