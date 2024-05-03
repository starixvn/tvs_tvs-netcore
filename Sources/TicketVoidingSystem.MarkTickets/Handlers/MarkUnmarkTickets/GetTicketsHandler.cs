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

public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly MapTicketService mapTicketService;
    private readonly PagingService pagingService;
    private readonly UserPermissionService userPermissionService;

    public GetTicketsHandler(GetTicketsService getTicketsService, MapTicketService mapTicketService, PagingService pagingService, UserPermissionService userPermissionService)
    {
        this.getTicketsService = getTicketsService;
        this.mapTicketService = mapTicketService;
        this.pagingService = pagingService;
        this.userPermissionService = userPermissionService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new TicketsViewModel();
        var getTicketsResult = await getTicketsService.GetTickets(request);

        viewModel.TotalItemsList = CreateMapToBetIdList(getTicketsResult.Tickets);
        viewModel.InvalidTransIds = getTicketsResult.Validation.InvalidTransIds;
        viewModel.MarkedTransIds = getTicketsResult.Validation.MarkedTransIds;
        viewModel.MovedTransIds = getTicketsResult.Validation.MovedTransIds;
        viewModel.Groups = await CreateGroupTicketsViewModel(getTicketsResult.Tickets, request);
        viewModel.TotalItems = getTicketsResult.Tickets.Count();
        viewModel.ParlayCount = getTicketsResult.Tickets.Count(item => item.IsMixParlay);
        viewModel.SingleCount = getTicketsResult.Tickets.Count(item => !item.IsMixParlay);
        viewModel.LicenseesName = GetLicenseesName(getTicketsResult.Tickets);
        UpdateTimeViewModel(viewModel, getTicketsResult.Tickets);

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

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroupTicketsViewModel(IEnumerable<GetTicketModel> tickets, GetTicketsQuery message)
    {
        var pagingTickets = pagingService.Paging(tickets, message.PageIndex, message.PageSize);
        return pagingTickets.Any() ? await CreateGroupTicketsViewModel(pagingTickets) : Enumerable.Empty<Group<TicketViewModel>>();
    }

    private async Task<IEnumerable<Group<TicketViewModel>>> CreateGroupTicketsViewModel(IEnumerable<GetTicketModel> pagingTickets)
    {
        var userPermission = await userPermissionService.GetUserPermission();
        var parlayTickets = pagingTickets.Where(ticket => ticket.IsMixParlay);
        var creditParlayTickets = parlayTickets.Where(ticket => !ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var depositParlayTickets = parlayTickets.Where(ticket => ticket.IsDeposit).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = pagingTickets.Where(ticket => !ticket.IsMixParlay);

        var groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        if (creditParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Credit (Parlay)", Tickets = creditParlayTickets });
        }
        if (depositParlayTickets.Any())
        {
            groups.Add(new Group<GetTicketModel> { Name = "Deposit (Parlay)", Tickets = depositParlayTickets });
        }

        return groups.Where(item => item.Tickets.Any()).Select(item => mapTicketService.MapToGroupTicketViewModel(item, userPermission));
    }

    private static string GetLicenseesName(IEnumerable<GetTicketModel> tickets)
    {
        var licensees = tickets.Where(item => item.IsDeposit)
            .Select(item => item.LicenseeName).Distinct().ToArray();
        Array.Sort(licensees, StringComparer.InvariantCulture);
        return string.Join(", ", licensees);
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, in IEnumerable<GetTicketModel> tickets)
    {
        if (!tickets.Any())
        {
            return;
        }

        model.ToTime = tickets.Max(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
        model.FromTime = tickets.Min(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
    }
}