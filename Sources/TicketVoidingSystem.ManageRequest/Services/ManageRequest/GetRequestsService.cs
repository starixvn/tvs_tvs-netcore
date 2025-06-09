using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestsService
{
    Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequests(SelectRequestsQuery query);
}

public class GetRequestsServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    GetRequestsInActiveTableService getRequestsInActiveTableService,
    GetRequestsInArchivedTableService getRequestsInArchivedTableService)
    : GetRequestsService
{
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

        return (requests.Distinct(new IgnoreDuplicateAbnormalAccountEqualityComparer()), requestInfoGetCalcTimes);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForActiveDataSearchByDate(SelectRequestsQuery query)
    {
        query.RequestInfoJson = await GetRequestInfoInActiveTable(query);
        return await getRequestsInActiveTableService.GetRequestsInActiveTable(query);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForArchivedDataSearchByDate(SelectRequestsQuery query)
    {
        var archivedRequestInfoJson = await GetRequestInfoInArchivedTable(query);
        if (string.IsNullOrWhiteSpace(archivedRequestInfoJson))
        {
            return ([], []);
        }

        query.RequestInfoJson = archivedRequestInfoJson;
        return await getRequestsInArchivedTableService.GetRequestsInArchivedTable(query);
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

    private async Task<string> GetRequestInfoInArchivedTable(SelectRequestsQuery query)
    {
        var criteriaArchived = mapper.Map<GetArchivedRequestInfoCriteria>(query);
        criteriaArchived.FromDate = query.FromDate;
        if (query.IsToDateBeforeBUDay == false)
        {
            criteriaArchived.ToDate = query.BUDay;
        }

        return await repository.GetAsync<string>(criteriaArchived);
    }
}