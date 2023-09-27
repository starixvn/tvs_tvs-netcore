using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<ListTicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, ListTicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly MatchService matchService;
    private readonly GroupTicketService groupTicketService;
    private readonly UpdateListTicketsViewModelService updateListTicketsViewModelService;

    public GetTicketsHandler(GetTicketsService getTicketsService, MatchService matchService, GroupTicketService groupTicketService,
        UpdateListTicketsViewModelService updateListTicketsViewModelService)
    {
        this.getTicketsService = getTicketsService;
        this.matchService = matchService;
        this.groupTicketService = groupTicketService;
        this.updateListTicketsViewModelService = updateListTicketsViewModelService;
    }

    public async Task<ListTicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var getTicketsResult = await getTicketsService.GetTickets(request);
        var model = new ListTicketsViewModel
        {
            Groups = await CreateGroups(request, getTicketsResult)
        };

        updateListTicketsViewModelService.Update(model, getTicketsResult);

        return model;
    }

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroups(GetTicketsQuery query, IEnumerable<GetTicketModel> getTicketsResult)
    {
        var match = await matchService.GetMatch(query.MatchId);
        var groupsGetTicket = groupTicketService.CreateGroupsGetTicketModel(getTicketsResult, query)
            .Where(item => item.Tickets.Any());
        var groups = new List<Group<TicketViewModel>>();

        foreach (var item in groupsGetTicket)
        {
            groups.Add(await groupTicketService.CreateGroupTicketViewModel(item, match));
        }

        return groups;
    }
}