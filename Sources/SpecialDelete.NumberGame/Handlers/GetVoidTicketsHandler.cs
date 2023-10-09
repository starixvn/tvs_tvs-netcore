using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.GetTickets;
using SpecialDelete.NumberGame.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.NumberGame.Handlers;

public class GetVoidTicketsRequest : GetVoidTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetVoidTicketsHandler : IRequestHandler<GetVoidTicketsRequest, TicketsViewModel>
{
    private readonly SessionService sessionService;
    private readonly Repository repository;
    private readonly PagingService pagingService;
    private readonly TicketService ticketService;

    public GetVoidTicketsHandler(SessionService sessionService, Repository repository, PagingService pagingService, TicketService ticketService)
    {
        this.sessionService = sessionService;
        this.repository = repository;
        this.pagingService = pagingService;
        this.ticketService = ticketService;
    }

    public async Task<TicketsViewModel> Handle(GetVoidTicketsRequest request, CancellationToken cancellationToken)
    {
        var model = await repository.GetVoidTickets(request);
        var viewModel = new TicketsViewModel
        {
            InvalidTransIds = model.InvalidTransIds,
            TotalItems = model.Tickets.Count
        };
        var tickets = pagingService.Paging(model.Tickets, request.PageIndex, request.PageSize);
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);
        foreach (var group in groups.Where(item => item.Tickets.Any()))
        {
            viewModel.Groups.Add(await AssignDataOnGroup(group));
        }

        return viewModel;
    }

    private async Task<Group<TicketViewModel>> AssignDataOnGroup(Group<GetTicketModel> group)
    {
        var tickets = new List<TicketViewModel>();
        var isDisable = !(await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidNumberGameBet, Constant.Policy.Host));
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = ticketService.GetTicket(item, isDisable, false);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}