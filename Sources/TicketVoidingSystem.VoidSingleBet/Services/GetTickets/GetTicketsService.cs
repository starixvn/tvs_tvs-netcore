using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface GetTicketsService
{
    Task<IList<GetTicketModel>> GetTickets(GetTicketsQuery query);

    Task<IList<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly IMapper mapper;
    private readonly MapTicketService mapTicketService;
    private readonly IDynamicRepository repository;

    public GetTicketsServiceImp(IDynamicRepository repository, IMapper mapper, MapTicketService mapTicketService)
    {
        this.repository = repository;
        this.mapper = mapper;
        this.mapTicketService = mapTicketService;
    }

    public async Task<IList<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        var ticketsInAllServers = new List<GetTicketModel>();
        var criteria = CreateGetTicketsCriteria(query);
        
        // Xài Task.WhenAll và SelectMany
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var tickets = await repository.FetchAsync<GetTicketModel>(criteria);
            ticketsInAllServers.AddRange(tickets);
        }

        return ticketsInAllServers.OrderBy(x => x.IsMixParlay).ToList();
    }

    public async Task<IList<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query)
    {
        var getTicketsResult = await GetTickets(query);
        var index = 1;
        var tickets = new List<ExcelTicketModel>();

        // Suy nghĩ xài linq
        // tham khảo link: https://stackoverflow.com/questions/269058/how-do-you-add-an-index-field-to-linq-results
        foreach (var item in getTicketsResult)
        {
            var excelTicket = mapTicketService.MapToTicketExcelModel(item, query.Match);
            excelTicket.No = index++;
            tickets.Add(excelTicket);
        }

        return tickets;
    }

    private GetTicketsCriteria CreateGetTicketsCriteria(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.LiveIndicator = query.EventType;
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.BetTypes = query.BetTypes.ToBetTypeXml();

        return criteria;
    }
}