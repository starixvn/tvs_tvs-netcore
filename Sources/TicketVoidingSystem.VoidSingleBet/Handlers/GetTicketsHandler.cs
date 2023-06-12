using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<ListTicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, ListTicketsViewModel>
{
    private readonly PagingService pagingService;
    private readonly GetTicketsService getTicketsService;
    private readonly MatchService matchService;
    private readonly SessionService sessionService;
    private readonly MapTicketService mapTicketService;
    private readonly UpdateListTicketsViewModelService updateListTicketsViewModelService;

    public GetTicketsHandler(PagingService pagingService, GetTicketsService getTicketsService, MatchService matchService,
        SessionService sessionService, MapTicketService mapTicketService, UpdateListTicketsViewModelService updateListTicketsViewModelService)
    {
        this.pagingService = pagingService;
        this.getTicketsService = getTicketsService;
        this.matchService = matchService;
        this.sessionService = sessionService;
        this.mapTicketService = mapTicketService;
        this.updateListTicketsViewModelService = updateListTicketsViewModelService;
    }

    public async Task<ListTicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var getTicketsResult = await getTicketsService.GetTickets(request);
        var model = new ListTicketsViewModel
        {
            Groups = await CreateGroupsTicketViewModel(request, getTicketsResult)
        };

        updateListTicketsViewModelService.Update(model, getTicketsResult);

        return model;
    }

    private IEnumerable<Group<GetTicketModel>> GetGroupsGetTicketModel(IEnumerable<GetTicketModel> data, GetTicketsQuery query)
    {
        var tickets = pagingService.Paging(data, query.PageIndex, query.PageSize).ToList();
        if (!tickets.Any())
        {
            return new List<Group<GetTicketModel>>();
        }
        return GetValueGroupsGetTicketModel(tickets);
    }

    private IEnumerable<Group<GetTicketModel>> GetValueGroupsGetTicketModel(IEnumerable<GetTicketModel> tickets)
    {
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId);
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);
        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        return groups;
    }

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroupsTicketViewModel(GetTicketsRequest request, IEnumerable<GetTicketModel> getTicketsResult)
    {
        var match = await matchService.GetMatch(request.MatchId);
        var groupsGetTicket = GetGroupsGetTicketModel(getTicketsResult, request).Where(item => item.Tickets.Any());
        var groups = new List<Group<TicketViewModel>>();

        foreach (var item in groupsGetTicket)
        {
            groups.Add(await CreateGroupTicketViewModel(item, match));
        }

        return groups;
    }

    private async Task<Group<TicketViewModel>> CreateGroupTicketViewModel(Group<GetTicketModel> group, Match match)
    {
        var permission = await GetUserPermission();
        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = mapTicketService.MapToTicketViewModel(item, match, permission);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }

    private async Task<UserPermission> GetUserPermission()
    {
        var settledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host);
        var unSettledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host);
        var instantlySettledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host);

        await Task.WhenAll(settledTicketPermissionTask, unSettledTicketPermissionTask, instantlySettledTicketPermissionTask);

        return new UserPermission
        {
            SettledTicket = settledTicketPermissionTask.Result,
            UnSettledTicket = unSettledTicketPermissionTask.Result,
            InstantlySettledTicket = instantlySettledTicketPermissionTask.Result
        };
    }
}