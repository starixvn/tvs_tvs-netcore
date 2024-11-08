using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using SpecialDelete.RecoverBet.Criteria;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.Repositories;
using SpecialDelete.RecoverBet.Services.RenderTicket;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverBet.Handlers;

public class GetTicketsRequest : GetTicketsCriteria, IRequest<TicketsViewModel>
{
    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    private readonly IRepository repository;
    private readonly PagingService pagingService;
    private readonly SessionService sessionService;
    private readonly ITicketService ticketService;

    public GetTicketsHandler(
        IRepository repository,
        PagingService pagingService,
        SessionService sessionService,
        ITicketService ticketService)
    {
        this.repository = repository;
        this.pagingService = pagingService;
        this.sessionService = sessionService;
        this.ticketService = ticketService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var model = await repository.GetTickets(request.TransIds);
        var viewModel = new TicketsViewModel
        {
            TotalItem = model.Tickets.Count,
            InvalidTransIds = model.InvalidTrans
        };
        var tickets = pagingService.Paging(model.Tickets, request.PageIndex, request.PageSize);
        var groups = pagingService.Groups(tickets, ticket => ticket.Site);
        foreach (var group in groups)
        {
            viewModel.Groups.Add(await RenderTickets(group));
        }

        return viewModel;
    }

    private async Task<Group<TicketViewModel>> RenderTickets(Group<GetTicketModel> group)
    {
        var tickets = new List<TicketViewModel>();
        var isReadOnly = !await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverSportsbookBet, Constant.Policy.Host);
        var index = 1;
        foreach (var ticket in group.Tickets.Select(item => ticketService.Render(item, isReadOnly)))
        {
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name.ToUpperInvariant(), Tickets = tickets };
    }
}