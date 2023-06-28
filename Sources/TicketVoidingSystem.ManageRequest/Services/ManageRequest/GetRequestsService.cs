using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
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

        var (activeRequests, activedInfoGetCalcTimes) = await HandleForActiveDataSearchByDate(query);
        var (archivedRequests, archivedInfoGetCalcTimes) = await HandleForArchivedDataSearchByDate(query);
        var filteredArchivedRequests = archivedRequests.Where(x => !activeRequests.Contains(x));
        var requests = activeRequests.Union(filteredArchivedRequests);
        var requestInfoGetCalcTimes = activedInfoGetCalcTimes.Union(archivedInfoGetCalcTimes);

        return (requests, requestInfoGetCalcTimes);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForActiveDataSearchByDate(SelectRequestsQuery query)
    {
        var activeRequestDetail = await GetRequestInfoInActiveTable(query);
        var activeRequestQuery = query;
        activeRequestQuery.RequestIdXml = activeRequestDetail.Select(x => x.RequestId).ToRequestIdXml();

        return await getRequestsInActiveTableService.GetRequestsInActiveTable(activeRequestQuery);
    }

    private async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> HandleForArchivedDataSearchByDate(SelectRequestsQuery query)
    {
        var requests = new List<RequestModel>();
        var requestInfoGetCalcTimes = new List<string>();
        var archivedRequestDetail = await GetRequestInfoInArchivedTable(query);
        var requestDetailHasArchivedRequest = archivedRequestDetail.Where(x => !x.IsActiveRequest);
        var requestDetailHasActiveRequest = archivedRequestDetail.Where(x => x.IsActiveRequest);

        if (requestDetailHasArchivedRequest.Any())
        {
            var archivedRequestQuery = query;
            archivedRequestQuery.RequestIdXml = requestDetailHasArchivedRequest.Select(x => x.RequestId).ToRequestIdXml();
            var (models, requestInfoGetCalcTime) = await getRequestsInArchivedTableService.GetRequestsInArchivedTable(archivedRequestQuery);
            requests.AddRange(models);
            requestInfoGetCalcTimes.AddRange(requestInfoGetCalcTime);
        }

        if (requestDetailHasActiveRequest.Any())
        {
            var activeRequestQuery = query;
            activeRequestQuery.RequestIdXml = requestDetailHasActiveRequest.Select(x => x.RequestId).ToRequestIdXml();
            var (models, requestInfoGetCalcTime) = await getRequestsInActiveTableService.GetRequestsInActiveTable(activeRequestQuery);
            requests.AddRange(models);
            requestInfoGetCalcTimes.AddRange(requestInfoGetCalcTime);
        }

        return (requests, requestInfoGetCalcTimes);
    }

    private async Task<IEnumerable<GetRequestInfoModel>> GetRequestInfoInActiveTable(SelectRequestsQuery query)
    {
        var criteriaActive = mapper.Map<GetActiveRequestInfoCriteria>(query);
        if (query.IsFromDateBeforeBUDay == true)
        {
            criteriaActive.FromDate = query.BUDay;
        }
        criteriaActive.ToDate = query.ToDate;
        var data = await repository.FetchAsync<GetRequestInfoModel>(criteriaActive);

        return data;
    }

    private async Task<IEnumerable<GetRequestInfoModel>> GetRequestInfoInArchivedTable(SelectRequestsQuery query)
    {
        var criteriaArchived = mapper.Map<GetArchivedRequestInfoCriteria>(query);
        criteriaArchived.FromDate = query.FromDate;
        if (query.IsToDateBeforeBUDay == false)
        {
            criteriaArchived.ToDate = query.BUDay;
        }

        var data = await repository.FetchAsync<GetRequestInfoModel>(criteriaArchived);

        return data;
    }
}