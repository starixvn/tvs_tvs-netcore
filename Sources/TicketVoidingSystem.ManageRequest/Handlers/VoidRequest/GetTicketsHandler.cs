using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Models.Parameters;
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
        var groups = GenerateGroup(data.ToList(), request).Where(item => item.Tickets.Any());
        var match = request.Match?.MatchId == 0 ? null : request.Match;
        var voidPermission = await checkPermissionOnRequestService.GetVoidPermission();

        model.Groups = MapToGroupTicketViewModel(request, groups, match, voidPermission);
        await ticketsViewModelService.UpdateViewModel(model, data, request.IssueTypeId, voidPermission, request.Match?.MatchId);

        return model;
    }

    private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> data, GetTicketsRequest message)
    {
        var tickets = pagingService.Paging(data, message.PageIndex, message.PageSize);
        if (!tickets.Any())
        {
            return Enumerable.Empty<Group<GetTicketModel>>();
        }

        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay);
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay);

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Credit (Parlay)", Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Deposit (Parlay)", Tickets = depositParlayTickets });
        }

        CountAllTicketsForGroup(data, groups);

        return groups;
    }

    private void CountAllTicketsForGroup(IEnumerable<GetTicketModel> originalTickets, IEnumerable<Group<GetTicketModel>> outputGroups)
    {
        var parlayTickets = originalTickets.Where(ticket => ticket.IsMixParlay);
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = originalTickets.Where(ticket => !ticket.IsMixParlay);

        var allGroups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Any())
        {
            allGroups.Add(new Group<GetTicketModel> { Name = "Credit (Parlay)", Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Any())
        {
            allGroups.Add(new Group<GetTicketModel> { Name = "Deposit (Parlay)", Tickets = depositParlayTickets });
        }

        foreach (var group in outputGroups)
        {
            var total = allGroups.Find(x => x.Name.Equals(group.Name, StringComparison.CurrentCultureIgnoreCase))?
                .Tickets.Count();
            group.DisplayTotalTickets = total ?? 0;
        }
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(GetTicketsRequest request, IEnumerable<Group<GetTicketModel>> groups, Match match, VoidPermission voidPermission)
    {
        var startIndex = request.PageIndex * request.PageSize + 1;
        var currentGroups = new List<Group<TicketViewModel>>();
        foreach (var item in groups)
        {
            var parameters = new GroupTicketsMappingParameters
            {
                Group = item,
                Match = match,
                StartIndex = startIndex,
                IssueTypeId = request.IssueTypeId,
                VoidPermission = voidPermission
            };
            var currentGroup = mapTicketsService.MapToGroupTicketViewModel(parameters);
            currentGroups.Add(currentGroup);
            startIndex += currentGroup.Tickets.Count();
        }
        return currentGroups;
    }
}