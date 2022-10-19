using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Core.Business;
using SpecialDelete.MarkTickets.Constants;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Services.GetTickets
{
    public interface IGetTicketsService
    {
        Task<(GetTicketValidationModel Validation, IEnumerable<GetTicketModel> Tickets)> GetTickets(GetTicketsQuery query);

        IEnumerable<GetTicketModel> GetDetailTickets(GetDetailTicketsQuery query);

        IEnumerable<AllMarkedTicketModel> GetAllMarkedTickets(AllMarkedTicketsQuery query);

        Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query);

        Group<TicketViewModel> AssignData(Group<GetTicketModel> group);
    }

    public class GetTicketsService : IGetTicketsService
    {
        private readonly IMapper mapper;
        private readonly ITicketService ticketService;
        private readonly SessionService sessionService;
        private readonly IDynamicRepository repository;

        public GetTicketsService(
            IMapper mapper,
            ITicketService ticketService,
            SessionService sessionService,
            IDynamicRepository repository)
        {
            this.mapper = mapper;
            this.ticketService = ticketService;
            this.sessionService = sessionService;
            this.repository = repository;
        }

        public async Task<(GetTicketValidationModel Validation, IEnumerable<GetTicketModel> Tickets)> GetTickets(GetTicketsQuery query)
        {
            var validationInAllServers = new List<GetTicketValidationModel>();
            var ticketsInAllServers = new List<GetTicketModel>();
            var criteria = mapper.Map<GetTicketsCriteria>(query);
            criteria.Duration = query.Durations.ToTransDateXml();
            criteria.BetTypes = query.BetTypes.ToBetTypeXml();

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var (validation, tickets) = await repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(criteria);

                validationInAllServers.AddRange(validation);
                ticketsInAllServers.AddRange(tickets);
            }

            var firstErrorResult = validationInAllServers.FirstOrDefault(x => !x.IsSuccessful);
            var combineValidation = new GetTicketValidationModel
            {
                ErrorCode = firstErrorResult?.ErrorCode ?? 0,
                ErrorMsg = firstErrorResult?.ErrorMsg ?? string.Empty,
                InvalidTransIds = Helper.GetIntersectTransIdString(validationInAllServers.Select(x => x.InvalidTransIds)),
                MarkedTransIds = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.MarkedTransIds)),
                MovedTransIds = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.MovedTransIds))
            };

            return (combineValidation, ticketsInAllServers.OrderBy(x => x.IsMixParlay));
        }

        public IEnumerable<GetTicketModel> GetDetailTickets(GetDetailTicketsQuery query)
        {
            return repository.GetDetailTickets(query).OrderBy(x => x.IsMixParlay);
        }

        public IEnumerable<AllMarkedTicketModel> GetAllMarkedTickets(AllMarkedTicketsQuery query)
        {
            return repository.GetAllMarkedTickets(query);
        }

        public async Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query)
        {
            var transInfoData = await repository.GetTransInfoForAutoUnmark(query);
            var result = await repository.GetDataForConfirmAutoUnmark(transInfoData);
            return result;
        }

        public Group<TicketViewModel> AssignData(Group<GetTicketModel> group)
        {
            var permission = new UserPermission
            {
                MarkTickets = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host),
                ViewUserName = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameofSpecialSiteonBetList, Constant.Policy.Read)
            };
            var tickets = new List<TicketViewModel>();
            var index = 1;
            foreach (var item in group.Tickets)
            {
                var ticket = ticketService.Render(item, permission);
                ticket.No = index++;
                if (!permission.ViewUserName && item.GroupName == SpecialSiteConstant.Site789Y)
                {
                    ticket.Member = "-";
                    ticket.Currency = "-";
                }
                tickets.Add(ticket);
            }

            return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
        }
    }
}