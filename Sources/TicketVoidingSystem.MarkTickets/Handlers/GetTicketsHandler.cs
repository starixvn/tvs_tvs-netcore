using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Services.GetTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class GetTicketsRequest : GetTicketsQuery, IRequest<TicketsViewModel>
    {
    }

    public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, TicketsViewModel>
    {
        private readonly IGetTicketsService getTicketsService;
        private readonly PagingService pagingService;

        public GetTicketsHandler(
            IGetTicketsService getTicketsService,
            PagingService pagingService)
        {
            this.getTicketsService = getTicketsService;
            this.pagingService = pagingService;
        }
        public Task<TicketsViewModel> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
        {
            var model = new TicketsViewModel();
            var getTicketsResult = getTicketsService.GetTickets(request);

            model.TotalItemsList = getTicketsResult.Tickets.Select(ticket =>
                new BetId
                {
                    TransId = ticket.IsMixParlay ? ticket.SubTransId.ToString() : ticket.TransId.ToString(),
                    SiteDbGroupId = ticket.SiteDbGroupId
                });
            model.InvalidTransIds = getTicketsResult.Validation.InvalidTransIds;
            model.MarkedTransIds = getTicketsResult.Validation.MarkedTransIds;
            model.MovedTransIds = getTicketsResult.Validation.MovedTransIds;

            var groups = GenerateGroup(getTicketsResult.Tickets, message);

            foreach (var item in groups.Where(item => item.Tickets.Any()))
            {
                model.Groups.Add(getTicketsService.AssignData(item));
            }

            UpdateViewModel(model, getTicketsResult.Tickets.ToList());

            return model;
        }


        private static void UpdateViewModel(TicketsViewModel model, IReadOnlyCollection<GetTicketModel> tickets)
        {
            model.TotalItems = tickets.Count;
            model.ParlayCount = tickets.Count(item => item.IsMixParlay);
            model.SingleCount = tickets.Count(item => !item.IsMixParlay);
            var licensees = tickets.Where(item => item.IsDeposit)
                 .Select(item => item.LicenseeName).Distinct().ToArray();
            Array.Sort(licensees, StringComparer.InvariantCulture);
            model.LicenseesName = string.Join(", ", licensees);
            UpdateTimeViewModel(model, tickets);
        }

        private static void UpdateTimeViewModel(TicketsViewModel model, IReadOnlyCollection<GetTicketModel> data)
        {
            if (!data.Any())
            {
                return;
            }
            model.ToTime = data.Max(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
            model.FromTime = data.Min(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
        }

        private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> data, GetTicketsRequest message)
        {
            var groups = new List<Group<GetTicketModel>>();
            var tickets = pagingService.Paging(data.ToList(), message.PageIndex, message.PageSize);
            if (!tickets.Any())
            {
                return groups;
            }
            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay).ToList();
            var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay)
                .OrderBy(ticket => ticket.TransId).ToList();
            groups = pagingService.Groups(singleTickets, ticket => ticket.GroupName);
            groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

            return groups;
        }


    }
}