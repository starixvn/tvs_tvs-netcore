using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using SpecialDelete.CashOutTransaction.Common.Services;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Criteria;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Services;

public interface DisplayUiService
{
    GetTicketsModel ExecuteQuery(GetTicketsQuery query);

    Task<Group<TicketViewModel>> Assign(Group<GetTicketModel> groupTickets);
}

public class DisplayUiServiceImp : DisplayUiService
{
    private readonly Repository repository;
    private readonly TicketHtmlService ticketHtmlService;
    private readonly SessionService sessionService;

    public DisplayUiServiceImp(
        Repository repository,
        TicketHtmlService ticketHtmlService,
        SessionService sessionService)
    {
        this.repository = repository;
        this.ticketHtmlService = ticketHtmlService;
        this.sessionService = sessionService;
    }

    public GetTicketsModel ExecuteQuery(GetTicketsQuery query)
    {
        var criteria = CreateCriteria(query);
        return repository.GetTicketsRecoverCashOut(criteria);
    }

    private static GetTicketsRecoverCashOutCriteria CreateCriteria(GetTicketsQuery query)
    {
        return new GetTicketsRecoverCashOutCriteria
        {
            TransIds = query.TransIds.DistinctWithComma()
        };
    }

    public async Task<Group<TicketViewModel>> Assign(Group<GetTicketModel> groupTickets)
    {
        var isDisable = !(await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverCashOutTransaction, Constant.Policy.Host));
        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in groupTickets.Tickets)
        {
            var ticketDetail = ticketHtmlService.GetTicket(item);
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
                IsDisable = isDisable,
                SiteDbGroupId = item.SiteDbGroupId
            };
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = groupTickets.Name, Tickets = tickets };
    }
}