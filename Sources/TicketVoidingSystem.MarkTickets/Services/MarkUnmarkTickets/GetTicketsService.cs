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

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;

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
    private readonly UserPermissionService userPermissionService;

    public GetTicketsServiceImp(IMapper mapper, MapTicketService mapTicketService, IDynamicRepository repository, UserPermissionService userPermissionService)
    {
        this.mapper = mapper;
        this.mapTicketService = mapTicketService;
        this.repository = repository;
        this.userPermissionService = userPermissionService;
    }

    public async Task<(GetTicketValidationModel Validation, IEnumerable<GetTicketModel> Tickets)> GetTickets(GetTicketsQuery query)
    {
        var (validationInAllServers, ticketsInAllServers) = await GetTicketsInMultipleServer(query);
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

    private async Task<(IEnumerable<GetTicketValidationModel>, IEnumerable<GetTicketModel>)> GetTicketsInMultipleServer(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.Duration = query.Durations.ToTransDateXml();
        criteria.BetTypes = query.BetTypes.ToBetTypeXml();

        var tasks = SiteDbGroupConstant.ServerList.Select(async server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return await repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(criteria);
        });

        (IEnumerable<GetTicketValidationModel> validation, IEnumerable<GetTicketModel> tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.validation);
        var ticketsInAllServers = results.SelectMany(x => x.tickets);
        return (validationInAllServers, ticketsInAllServers);
    }

    public async Task<IEnumerable<ExcelTicketModel>> GetTicketsForExportExcel(GetTicketsQuery query)
    {
        var userPermission = await userPermissionService.GetUserPermission();
        var getTicketsResult = await GetTickets(query);
        var tickets = mapTicketService.MapToExcelTicketModel(getTicketsResult.Tickets, userPermission);

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
        var userPermission = await userPermissionService.GetUserPermission();
        var data = await GetDetailTickets(query);
        var tickets = mapTicketService.MapToExcelTicketModel(data, userPermission);

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