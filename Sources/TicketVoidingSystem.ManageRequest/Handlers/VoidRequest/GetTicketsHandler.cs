using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;
    private readonly TicketsViewModelService ticketsViewModelService;
    private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;

    public GetTicketsHandler(
        GetTicketsService getTicketsService, MapTicketsService mapTicketsService,
        PagingService pagingService, TicketsViewModelService ticketsViewModelService, CheckPermissionOnRequestService checkPermissionOnRequestService)
    {
        this.getTicketsService = getTicketsService;
        this.mapTicketsService = mapTicketsService;
        this.pagingService = pagingService;
        this.ticketsViewModelService = ticketsViewModelService;
        this.checkPermissionOnRequestService = checkPermissionOnRequestService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var model = new TicketsViewModel();
        var data = await getTicketsService.GetTickets(request);
        var groups = GenerateGroup(data.ToList(), request);
        var index = (request.PageIndex * request.PageSize) + 1;
        var voidPermission = checkPermissionOnRequestService.GetVoidPermission();
        var match = request.Match?.MatchId == 0 ? null : request.Match;
        // Jacob, Đừng để linq groups.Where trong foreach, tách ra 1 biến
        // Tách cái foreach này ra 1 hàm, input là groups, output là 1 List các currentGroup
        foreach (var item in groups.Where(item => item.Tickets.Any()))
        {
            var currentGroup = mapTicketsService.MapToGroupTicketViewModel(item, match, index, request.IssueTypeId, voidPermission);
            model.Groups.Add(currentGroup);
            index += currentGroup.Tickets.Count();
        }
        ticketsViewModelService.UpdateViewModel(model, data, request.IssueTypeId, request.SubIssueTypeId, voidPermission);

        return model;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> data, GetTicketsRequest message)
    {
        var tickets = pagingService.Paging(data, message.PageIndex, message.PageSize);
        if (tickets.Any())
        {
            var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay)
                .OrderBy(ticket => ticket.TransId).ToList();
            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);
            var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
            groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });
            CountAllTicketsForGroup(data, groups);

            return groups;
        }

        return Enumerable.Empty<Group<GetTicketModel>>();
    }

    private void CountAllTicketsForGroup(IEnumerable<GetTicketModel> originalTickets, IEnumerable<Group<GetTicketModel>> outputGroups)
    {
        var parlayTickets = originalTickets.Where(ticket => ticket.IsMixParlay)
            .OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = originalTickets.Where(ticket => !ticket.IsMixParlay);
        var allGroups = pagingService.Groups(singleTickets, t => t.GroupName).ToList();
        allGroups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        foreach (var group in outputGroups)
        {
            var total = allGroups.Find(x => x.Name.Equals(group.Name, StringComparison.CurrentCultureIgnoreCase))?
                .Tickets.Count();
            group.DisplayTotalTickets = total ?? 0;
        }
    }
}