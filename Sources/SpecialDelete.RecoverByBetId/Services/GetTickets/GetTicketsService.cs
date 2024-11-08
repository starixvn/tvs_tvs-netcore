using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Repositories;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverByBetId.Services.GetTickets;

public interface GetTicketsService
{
    Task<GetTicketsModel> GetTickets(GetTicketsQuery query);

    Task<Group<TicketViewModel>> GetViewModel(Group<GetTicketModel> group);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly Repository repository;
    private readonly TicketService ticketService;
    private readonly SessionService sessionService;

    public GetTicketsServiceImp(
        Repository repository,
        TicketService ticketService,
        SessionService sessionService)
    {
        this.repository = repository;
        this.ticketService = ticketService;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> GetTickets(GetTicketsQuery query)
    {
        return await repository.GetTickets(query.TransIds);
    }

    public async Task<Group<TicketViewModel>> GetViewModel(Group<GetTicketModel> group)
    {
        var index = 1;
        var tickets = new List<TicketViewModel>();
        var isReadOnlyPermission = !await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverByBetID, Constant.Policy.Host);
        foreach (var item in group.Tickets)
        {
            var ticket = ticketService.GetTicket(item, ChoiceType.Html);
            ticket.No = index++;
            ticket.IsDisable = isReadOnlyPermission;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}