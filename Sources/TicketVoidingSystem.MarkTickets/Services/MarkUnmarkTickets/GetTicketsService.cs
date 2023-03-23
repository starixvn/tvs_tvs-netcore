using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets
{
    public interface GetTicketsService
    {
        Task<(GetTicketValidationModel Validation, IEnumerable<GetTicketModel> Tickets)> GetTickets(GetTicketsQuery query);

        Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query);

        Task<IEnumerable<GetTicketModel>> GetDetailTickets(GetDetailTicketsQuery query);

        Task<IEnumerable<ExcelTicketModel>> GetDetailTicketsForExportExcel(GetDetailTicketsQuery query);

        Task<IEnumerable<AllMarkedTicketModel>> GetAllMarkedTickets(AllMarkedTicketsQuery query);
    }

    public class GetTicketsServiceImp : GetTicketsService
    {
        private readonly IMapper mapper;
        private readonly MapTicketService mapTicketService;
        private readonly IDynamicRepository repository;

        public GetTicketsServiceImp(
            IMapper mapper,
            MapTicketService mapTicketService,
            IDynamicRepository repository)
        {
            this.mapper = mapper;
            this.mapTicketService = mapTicketService;
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
            var tickets = mapTicketService.MapToExcelTicketModel(getTicketsResult.Tickets);

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
            var tickets = mapTicketService.MapToExcelTicketModel(data);

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
    }
}