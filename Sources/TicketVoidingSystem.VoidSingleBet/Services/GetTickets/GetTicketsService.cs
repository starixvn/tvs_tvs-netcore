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
        var criteria = CreateGetTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<GetTicketModel>(criteria);
        });

        var ticketsLists = await Task.WhenAll(tasks);
        var ticketsInAllServers = ticketsLists.SelectMany(tickets => tickets).ToList();

        return ticketsInAllServers.OrderBy(x => x.IsMixParlay).ToList();
    }

    public async Task<IList<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query)
    {
        var getTicketsResult = await GetTickets(query);

        var tickets = getTicketsResult.Select((item, index) =>
        {
            var excelTicket = mapTicketService.MapToTicketExcelModel(item, query.Match);
            excelTicket.No = index + 1;
            return excelTicket;
        }).ToList();

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