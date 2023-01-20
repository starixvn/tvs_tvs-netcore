using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Services
{
    public interface GetTicketsService
    {
        Task<TicketsViewModel> GetTickets(GetTicketsDetailQuery query);

        Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(ExportExcelQuery query);
    }

    public class GetTicketsServiceImp : GetTicketsService
    {
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;
        private readonly AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService;
        private readonly MapTicketService mapTicketService;

        public GetTicketsServiceImp(IMapper mapper, IDynamicRepository repository, AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService, MapTicketService mapTicketService)
        {
            this.mapper = mapper;
            this.repository = repository;
            this.affectTicketsFromSettlementHistoryService = affectTicketsFromSettlementHistoryService;
            this.mapTicketService = mapTicketService;
        }

        public async Task<TicketsViewModel> GetTickets(GetTicketsDetailQuery query)
        {
            var viewModel = new TicketsViewModel();
            var criteria = await CreateCriteria(query);
            var tickets = await repository.FetchAsync<DetailTicketModel>(criteria);
            var pagingTickets = Paging(tickets, query.PageSize, query.PageIndex);
            viewModel.Tickets = mapTicketService.MapToListTicketsViewModel(pagingTickets);
            viewModel.TotalItems = tickets.Count();

            return viewModel;
        }

        public async Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(ExportExcelQuery query)
        {
            var criteria = await CreateCriteria(query);
            var tickets = await repository.FetchAsync<DetailTicketModel>(criteria);
            var ticketsViewModel = mapTicketService.MapToListTicketsViewModel(tickets);
            var excelTickets = mapTicketService.MapToListExcelTicketsModel(ticketsViewModel);
            return excelTickets;
        }

        private async Task<GetTicketsDetailCriteria> CreateCriteria(GetDetailQuery query)
        {
            var criteria = mapper.Map<GetTicketsDetailCriteria>(query);
            criteria.BetTypes = query.BetTypes.DistinctWithComma();
            criteria.FromTransDate = query.FromTransDate.ZoneCanada();
            criteria.ToTransDate = query.ToTransDate.ZoneCanada();
            criteria.LiveType = query.EventType;
            criteria.SecondAcceptFlag = query.TicketType;
            criteria.Type = query.Product;
            criteria.BetTeams = query.BetTeams.ToBetTypeXml();
            criteria.AffectTickets = await affectTicketsFromSettlementHistoryService.GetTickets(query.IsReSettled, query.MatchId);

            return criteria;
        }

        private static IEnumerable<DetailTicketModel> Paging(IEnumerable<DetailTicketModel> tickets, int size, int index)
        {
            var skip = size * index;
            return tickets.Skip(skip).Take(size).ToList();
        }
    }
}