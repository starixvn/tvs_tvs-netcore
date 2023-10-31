using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByBetId.Services.GetTickets;

public interface GetTicketsService
{
    Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds)> GetTickets(GetTicketsQuery query);

    Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupTicket, bool isVoidByBetId);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly VoidByBetIdRepository repository;
    private readonly SessionService sessionService;
    private readonly TicketService ticketHtmlService;

    public GetTicketsServiceImp(
        VoidByBetIdRepository repository,
        SessionService sessionService,
        TicketService ticketHtmlService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.ticketHtmlService = ticketHtmlService;
    }

    public async Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds)> GetTickets(GetTicketsQuery query)
    {
        return await repository.GetTickets(query);
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupTicket, bool isVoidByBetId)
    {
        var permission = new UserPermission
        {
            SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host),
            UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host)
        };

        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in groupTicket.Tickets)
        {
            var ticket = ticketHtmlService.GetTicket(item, permission, isVoidByBetId);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = groupTicket.Name, Tickets = tickets };
    }
}