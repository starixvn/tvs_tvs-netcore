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

    public GetTicketsHandler(
        GetTicketsService getTicketsService,
        MapTicketService mapTicketService,
        PagingService pagingService)
    {
        this.getTicketsService = getTicketsService;
        this.mapTicketService = mapTicketService;
        this.pagingService = pagingService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new TicketsViewModel();
        var getTicketsResult = await getTicketsService.GetTickets(request);

        viewModel.TotalItemsList = CreateMapToBetIdList(getTicketsResult.Tickets);
        viewModel.InvalidTransIds = getTicketsResult.Validation.InvalidTransIds;
        viewModel.MarkedTransIds = getTicketsResult.Validation.MarkedTransIds;
        viewModel.MovedTransIds = getTicketsResult.Validation.MovedTransIds;
        viewModel.Groups = CreateGroupTicketsViewModel(getTicketsResult.Tickets, request);
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

    private IEnumerable<Group<TicketViewModel>> CreateGroupTicketsViewModel(in IEnumerable<GetTicketModel> tickets, in GetTicketsRequest message)
    {
        var pagingTickets = pagingService.Paging(tickets, message.PageIndex, message.PageSize);
        return pagingTickets.Any() ? CreateGroupTicketsViewModel(pagingTickets) : Enumerable.Empty<Group<TicketViewModel>>();
    }

    private IEnumerable<Group<TicketViewModel>> CreateGroupTicketsViewModel(in IEnumerable<GetTicketModel> pagingTickets)
    {
        var singleTickets = pagingTickets.Where(ticket => !ticket.IsMixParlay);
        var parlayTickets = pagingTickets.Where(ticket => ticket.IsMixParlay)
            .OrderBy(ticket => ticket.TransId);
        var groupsTickets = pagingService.Groups(singleTickets, ticket => ticket.GroupName).ToList();
        groupsTickets.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        return groupsTickets.Where(item => item.Tickets.Any())
            .Select(item => mapTicketService.MapToGroupTicketViewModel(item));
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