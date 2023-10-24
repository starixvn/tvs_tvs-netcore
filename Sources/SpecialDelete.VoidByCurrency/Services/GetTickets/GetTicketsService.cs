using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface GetTicketsService
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);

    Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupTicket, bool isOutright);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly VoidByCurrencyRepository repository;
    private readonly SessionService sessionService;
    private readonly TicketService ticketHtmlService;

    public GetTicketsServiceImp(
        VoidByCurrencyRepository repository,
        SessionService sessionService,
        TicketService ticketHtmlService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.ticketHtmlService = ticketHtmlService;
    }

    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        return await repository.GetTickets(query);
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupTicket, bool isOutright)
    {
        var userPermission = new UserPermission
        {
            SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host),
            UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host)
        };
        var index = 1;
        var tickets = new List<TicketViewModel>();
        foreach (var item in groupTicket.Tickets)
        {
            var ticket = ticketHtmlService.GetTicketDetail(item, userPermission, isOutright);
            ticket.No = index++;
            ticket.BetId = item.TransId.ToString();
            ticket.SubTransId = item.SubTransId.ToString();
            ticket.Member = item.UserName;
            ticket.CurrencyCode = item.CurrencyCode;
            ticket.IsCricket = item.IsCricket;
            ticket.MainTransId = item.MainTransId.ToString();
            ticket.IsMarked = item.IsMarked;
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = groupTicket.Name, Tickets = tickets };
    }
}