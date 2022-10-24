using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Core.Business;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.GetTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets
{
    public interface GetTicketsService
    {
        Task<(GetTicketValidationModel Validation, IEnumerable<GetTicketModel> Tickets)> GetTickets(GetTicketsQuery query);

        Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query);

        Task<IEnumerable<GetTicketModel>> GetDetailTickets(GetDetailTicketsQuery query);

        Task<IEnumerable<ExcelTicketModel>> GetDetailTicketsForExportExcel(GetDetailTicketsQuery query);

        Task<IEnumerable<AllMarkedTicketModel>> GetAllMarkedTickets(AllMarkedTicketsQuery query);

        Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query);

        Group<TicketViewModel> MapToViewModel(in Group<GetTicketModel> group);
    }

    public class GetTicketsServiceImp : GetTicketsService
    {
        private readonly IMapper mapper;
        private readonly ITicketService ticketService;
        private readonly SessionService sessionService;
        private readonly IDynamicRepository repository;

        public GetTicketsServiceImp(
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

        public async Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query)
        {
            var getTicketsResult = await GetTickets(query);
            var tickets = MapToExcelTicketModel(getTicketsResult.Tickets);

            return tickets;
        }

        public async Task<IEnumerable<GetTicketModel>> GetDetailTickets(GetDetailTicketsQuery query)
        {
            var ticketsInAllServers = new List<GetTicketModel>();
            var criteria = mapper.Map<GetDetailTicketsCriteria>(query);
            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var tickets = await repository.FetchAsync<GetTicketModel>(criteria);
                ticketsInAllServers.AddRange(tickets);
            }

            return ticketsInAllServers.OrderBy(x => x.IsMixParlay);
        }

        public async Task<IEnumerable<ExcelTicketModel>> GetDetailTicketsForExportExcel(GetDetailTicketsQuery query)
        {
            var data = await GetDetailTickets(query);
            var tickets = MapToExcelTicketModel(data);

            return tickets;
        }

        public async Task<IEnumerable<AllMarkedTicketModel>> GetAllMarkedTickets(AllMarkedTicketsQuery query)
        {
            var dataInAllServers = new List<AllMarkedTicketModel>();
            var criteria = mapper.Map<AllMarkedTicketsCriteria>(query);
            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var data = await repository.FetchAsync<AllMarkedTicketModel>(criteria);
                dataInAllServers.AddRange(data);
            }

            return dataInAllServers;
        }

        public async Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query)
        {
            var transInfoData = await repository.GetTransInfoForAutoUnmark(query);
            var result = await repository.GetDataForConfirmAutoUnmark(transInfoData);
            return result;
        }

        public Group<TicketViewModel> MapToViewModel(in Group<GetTicketModel> group)
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

        private IEnumerable<ExcelTicketModel> MapToExcelTicketModel(in IEnumerable<GetTicketModel> data)
        {
            var index = 1;
            var tickets = new List<ExcelTicketModel>();
            var canViewUserName = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameofSpecialSiteonBetList, Constant.Policy.Read);
            foreach (var item in data)
            {
                var ticketDetail = ticketService.Render(item);
                var ticket = mapper.Map<ExcelTicketModel>(ticketDetail);
                ticket.No = index++;
                ticket.BetId = ticketDetail.BetId.LineBreak();
                ticket.Member = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Member.LineBreak();
                ticket.Currency = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Currency.LineBreak();
                ticket.Odds = ticketDetail.Odds.DefaultText();
                ticket.Stake = ticketDetail.Stake.StakeText();
                ticket.Status = ticketDetail.Status.DefaultText();
                ticket.Choice = ticketDetail.Choice.ChoiceSubParlay(item.IsMixParlay);
                tickets.Add(ticket);
            }

            return tickets;
        }
    }
}