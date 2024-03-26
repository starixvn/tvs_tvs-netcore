using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestsService
{
    Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequests(SelectRequestsQuery query);
}

public class GetRequestsServiceImp : GetRequestsService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRequestsInActiveTableService getRequestsInActiveTableService;
    private readonly GetRequestsInArchivedTableService getRequestsInArchivedTableService;

    public GetRequestsServiceImp(IMapper mapper, IDynamicRepository repository,
        GetRequestsInActiveTableService getRequestsInActiveTableService, GetRequestsInArchivedTableService getRequestsInArchivedTableService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.getRequestsInActiveTableService = getRequestsInActiveTableService;
        this.getRequestsInArchivedTableService = getRequestsInArchivedTableService;
    }

    public async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequests(SelectRequestsQuery query)
    {
        if (query.RequestId != null || query.MatchId != null)
        {
            return await getRequestsInActiveTableService.GetRequestsInActiveTable(query);
        }

        if (query.IsFromDateBeforeBUDay == false)
        {
            return await HandleForActiveDataSearchByDate(query);
        }

        if (query.IsToDateBeforeBUDay == true)
        {
            return await HandleForArchivedDataSearchByDate(query);
        }

        var (activeRequests, activeInfoGetCalcTimes) = await HandleForActiveDataSearchByDate(query);
        var (archivedRequests, archivedInfoGetCalcTimes) = await HandleForArchivedDataSearchByDate(query);
        var filteredArchivedRequests = archivedRequests.Where(x => !activeRequests.Contains(x));
        var requests = activeRequests.Union(filteredArchivedRequests);
        var requestInfoGetCalcTimes = activeInfoGetCalcTimes.Union(archivedInfoGetCalcTimes);

        return (requests, requestInfoGetCalcTimes);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForActiveDataSearchByDate(SelectRequestsQuery query)
    {
        var activeRequestQuery = query;
        activeRequestQuery.RequestInfoJson = await GetRequestInfoInActiveTable(query);

        return await getRequestsInActiveTableService.GetRequestsInActiveTable(activeRequestQuery);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForArchivedDataSearchByDate(SelectRequestsQuery query)
    {
        var requests = new List<RequestModel>();
        var requestInfoGetCalcTimes = new List<string>();
        var (activeRequestInfoJson, archivedRequestInfoJson) = await GetRequestInfoInArchivedTable(query);

        if (!string.IsNullOrWhiteSpace(archivedRequestInfoJson))
        {
            var archivedRequestQuery = query;
            archivedRequestQuery.RequestInfoJson = archivedRequestInfoJson;
            var (models, requestInfoGetCalcTime) = await getRequestsInArchivedTableService.GetRequestsInArchivedTable(archivedRequestQuery);
            requests.AddRange(models);
            requestInfoGetCalcTimes.AddRange(requestInfoGetCalcTime);
        }

        if (!string.IsNullOrWhiteSpace(activeRequestInfoJson))
        {
            var activeRequestQuery = query;
            activeRequestQuery.RequestInfoJson = activeRequestInfoJson;
            var (models, requestInfoGetCalcTime) = await getRequestsInActiveTableService.GetRequestsInActiveTable(activeRequestQuery);
            requests.AddRange(models);
            requestInfoGetCalcTimes.AddRange(requestInfoGetCalcTime);
        }

        return (requests, requestInfoGetCalcTimes);
    }

    private async Task<string> GetRequestInfoInActiveTable(SelectRequestsQuery query)
    {
        var criteriaActive = mapper.Map<GetActiveRequestInfoCriteria>(query);
        if (query.IsFromDateBeforeBUDay == true)
        {
            criteriaActive.FromDate = query.BUDay;
        }
        criteriaActive.ToDate = query.ToDate;

        return await repository.GetAsync<string>(criteriaActive);
    }

    private async Task<(string, string)> GetRequestInfoInArchivedTable(SelectRequestsQuery query)
    {
        var criteriaArchived = mapper.Map<GetArchivedRequestInfoCriteria>(query);
        criteriaArchived.FromDate = query.FromDate;
        if (query.IsToDateBeforeBUDay == false)
        {
            criteriaArchived.ToDate = query.BUDay;
        }

        var (ActiveRequestsJson, ArchivedRequestsJson) = await repository.FetchMultipleAsync<string, string>(criteriaArchived);

        return (ActiveRequestsJson.First(), ArchivedRequestsJson.First());
    }
}