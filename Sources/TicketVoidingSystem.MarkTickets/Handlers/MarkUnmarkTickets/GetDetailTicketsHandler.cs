using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;

public class GetDetailTicketsRequest : GetDetailTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetDetailTicketsHandler : IRequestHandler<GetDetailTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly MapTicketService mapTicketService;
    private readonly PagingService pagingService;
    private readonly UserPermissionService userPermissionService;

    public GetDetailTicketsHandler(
        GetTicketsService getTicketsService,
        MapTicketService mapTicketService,
        PagingService pagingService,
        UserPermissionService userPermissionService)
    {
        this.getTicketsService = getTicketsService;
        this.mapTicketService = mapTicketService;
        this.pagingService = pagingService;
        this.userPermissionService = userPermissionService;
    }

    public async Task<TicketsViewModel> Handle(GetDetailTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new TicketsViewModel();
        var tickets = await getTicketsService.GetDetailTickets(request);
        viewModel.TotalItemsList = CreateMapToBetIdList(tickets);
        viewModel.Groups = await CreateGroupTicketsViewModel(tickets, request);
        viewModel.TotalItems = tickets.Count();
        viewModel.SingleCount = tickets.Count(item => !item.IsMixParlay);
        viewModel.ParlayCount = tickets.Count(item => item.IsMixParlay);
        viewModel.LicenseesName = GetLicenseesName(tickets);
        UpdateTimeViewModel(viewModel, tickets);

        return viewModel;
    }

    private static IEnumerable<BetId> CreateMapToBetIdList(in IEnumerable<GetTicketModel> tickets)
    {
        return tickets.Select(ticket => new BetId
        {
            TransId = ticket.IsMixParlay ? ticket.SubTransId.ToString() : ticket.TransId.ToString(),
            SiteDbGroupId = ticket.SiteDbGroupId
        });
    }

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroupTicketsViewModel(IEnumerable<GetTicketModel> tickets, GetDetailTicketsQuery message)
    {
        var pagingTickets = pagingService.Paging(tickets, message.PageIndex, message.PageSize);
        return pagingTickets.Any() ? await CreateGroupTicketsViewModel(pagingTickets) : Enumerable.Empty<Group<TicketViewModel>>();
    }

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroupTicketsViewModel(IEnumerable<GetTicketModel> pagingTickets)
    {
        var userPermission = await userPermissionService.GetUserPermission();
        var singleTickets = pagingTickets.Where(ticket => !ticket.IsMixParlay);
        var parlayTickets = pagingTickets.Where(ticket => ticket.IsMixParlay)
            .OrderBy(ticket => ticket.TransId);
        var groupsTickets = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        groupsTickets.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        return groupsTickets.Where(item => item.Tickets.Any())
            .Select(item => mapTicketService.MapToGroupTicketViewModel(item, userPermission));
    }

    private static string GetLicenseesName(IEnumerable<GetTicketModel> tickets)
    {
        var licensees = tickets.Where(item => item.IsDeposit)
            .Select(item => item.LicenseeName).Distinct().ToArray();
        Array.Sort(licensees, StringComparer.InvariantCulture);
        return string.Join(", ", licensees);
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> tickets)
    {
        if (!tickets.Any())
        {
            return;
        }
        model.FromTime = tickets.Min(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
        model.ToTime = tickets.Max(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
    }
}