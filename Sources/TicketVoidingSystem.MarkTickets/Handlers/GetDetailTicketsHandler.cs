namespace TicketVoidingSystem.MarkTickets.Handlers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Common.Services;
    using Common.Systems;
    using Core.DTO;
    using Criteria;
    using MediatR;
    using Models;
    using Services.GetTickets;
    using ViewModels;

    public class GetDetailTicketsRequest : GetDetailTicketsQuery, IRequest<TicketsViewModel>
    {
    }

    public class GetDetailTicketsHandler : IRequestHandler<GetDetailTicketsRequest, TicketsViewModel>
    {
        private readonly IGetTicketsService getTicketsService;
        private readonly IPagingService paggingService;

        public GetDetailTicketsHandler(
            IGetTicketsService getTicketsService,
            IPagingService paggingService)
        {
            this.getTicketsService = getTicketsService;
            this.paggingService = paggingService;
        }

        public TicketsViewModel Handle(GetDetailTicketsRequest message)
        {
            var model = new TicketsViewModel();

            var tickets = getTicketsService.GetDetailTickets(message);

            model.TotalItemsList = tickets.Select(ticket =>
                new BetId
                {
                    TransId = ticket.IsMixParlay ? ticket.SubTransId.ToString() : ticket.TransId.ToString(),
                    SiteDbGroupId = ticket.SiteDbGroupId
                });
            var groups = GenerateGroup(tickets, message);

            foreach (var item in groups.Where(item => item.Tickets.Any()))
            {
                model.Groups.Add(getTicketsService.AssignData(item));
            }

            UpdateViewModel(model, tickets);

            return model;
        }

        private static void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> tickets)
        {
            model.TotalItems = tickets.Count();
            var singleTickets = tickets.Where(item => !item.IsMixParlay).ToList();
            model.SingleCount = singleTickets.Count;
            var parlayTickets = tickets.Where(item => item.IsMixParlay).ToList();
            model.ParlayCount = parlayTickets.Count;
            var licensees = tickets.Where(item => item.IsDeposit)
                 .Select(item => item.LicenseeName).Distinct().ToArray();
            Array.Sort(licensees, StringComparer.InvariantCulture);
            model.LicenseesName = string.Join(", ", licensees);
            UpdateTimeViewModel(model, tickets);
        }

        private IEnumerable<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> inputTickets, GetDetailTicketsRequest message)
        {
            var groups = new List<Group<GetTicketModel>>();
            var tickets = paggingService.Paging(inputTickets.ToList(), message.PageIndex, message.PageSize);
            if (!tickets.Any())
            {
                return groups;
            }

            var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay).ToList();
            groups = paggingService.Groups(singleTickets, ticket => ticket.GroupName);
            var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay)
                .OrderBy(ticket => ticket.TransId).ToList();
            groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

            return groups;
        }

        private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
        {
            if (!data.Any())
            {
                return;
            }
            model.FromTime = data.Min(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
            model.ToTime = data.Max(item => item.TransDate).ZoneManila().ToString("hh:mm:ss tt");
        }
    }
}