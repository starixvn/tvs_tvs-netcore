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

    public GetDetailTicketsHandler(
        GetTicketsService getTicketsService,
        MapTicketService mapTicketService,
        PagingService pagingService)
    {
        this.getTicketsService = getTicketsService;
        this.mapTicketService = mapTicketService;
        this.pagingService = pagingService;
    }

    public async Task<TicketsViewModel> Handle(GetDetailTicketsRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new TicketsViewModel();
        var tickets = await getTicketsService.GetDetailTickets(request);
        viewModel.TotalItemsList = CreateMapToBetIdList(tickets);
        viewModel.Groups = CreateGroupTicketsViewModel(tickets, request);
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

    private IEnumerable<Group<TicketViewModel>> CreateGroupTicketsViewModel(in IEnumerable<GetTicketModel> tickets, in GetDetailTicketsRequest message)
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