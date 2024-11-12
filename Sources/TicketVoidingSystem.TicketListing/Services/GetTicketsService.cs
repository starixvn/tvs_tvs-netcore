using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Services;

public interface GetTicketsService
{
    Task<TicketsViewModel> GetTickets(GetTicketsDetailQuery query);

    Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(ExportExcelQuery query);

    Task<ExcelOicModel> GetTicketsForSendDataOic(SendFileQuery query, string affectedTickets);
}

public class GetTicketsServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService,
    MapTicketService mapTicketService)
    : GetTicketsService
{
    public async Task<TicketsViewModel> GetTickets(GetTicketsDetailQuery query)
    {
        var viewModel = new TicketsViewModel();
        var criteria = CreateCriteria(query);
        criteria.AffectTickets = await affectTicketsFromSettlementHistoryService.GetTickets(query.IsReSettled, query.MatchId);
        var tickets = await repository.FetchAsync<DetailTicketModel>(criteria);
        var pagingTickets = Paging(tickets, query.PageSize, query.PageIndex);
        viewModel.Tickets = mapTicketService.MapToListTicketsViewModel(pagingTickets);
        viewModel.TotalItems = tickets.Count();

        return viewModel;
    }

    public async Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(ExportExcelQuery query)
    {
        var criteria = CreateCriteria(query);
        criteria.AffectTickets = await affectTicketsFromSettlementHistoryService.GetTickets(query.IsReSettled, query.MatchId);
        var tickets = await repository.FetchAsync<DetailTicketModel>(criteria);
        var ticketsViewModel = mapTicketService.MapToListTicketsViewModel(tickets);
        var excelTickets = mapTicketService.MapToListExcelTicketsModel(ticketsViewModel);
        return excelTickets;
    }

    public async Task<ExcelOicModel> GetTicketsForSendDataOic(SendFileQuery query, string affectedTickets)
    {
        var ticketDetailCriteria = CreateCriteria(query);
        var criteria = mapper.Map<GetTicketExcelOicCriteria>(ticketDetailCriteria);
        criteria.AffectTickets = affectedTickets;
        var ticketsJson = await repository.GetAsync<ExcelOicModel>(criteria);

        return ticketsJson;
    }

    private GetTicketsDetailCriteria CreateCriteria(GetDetailQuery query)
    {
        var criteria = mapper.Map<GetTicketsDetailCriteria>(query);
        criteria.BetTypes = query.BetTypes.DistinctWithComma();
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.LiveType = query.EventType;
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.Type = query.Product;
        criteria.BetTeams = query.BetTeams.ToBetTypeXml();

        return criteria;
    }

    private static IEnumerable<DetailTicketModel> Paging(IEnumerable<DetailTicketModel> tickets, int size, int index)
    {
        var skip = size * index;
        return tickets.Skip(skip).Take(size).ToList();
    }
}