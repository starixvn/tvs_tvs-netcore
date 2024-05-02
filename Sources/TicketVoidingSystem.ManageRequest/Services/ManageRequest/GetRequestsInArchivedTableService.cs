using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestsInArchivedTableService
{
    Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequestsInArchivedTable(SelectRequestsQuery query);
}

public class GetRequestsInArchivedTableServiceImp : GetRequestsInArchivedTableService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly BetListService betListService;

    public GetRequestsInArchivedTableServiceImp(IMapper mapper, IDynamicRepository repository, BetListService betListService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.betListService = betListService;
    }

    public async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequestsInArchivedTable(SelectRequestsQuery query)
    {
        var criteriaArchived = mapper.Map<SelectArchivedRequestsCriteria>(query);
        var (requests, requestInfoGetCalcTime, betTypeForRequests) = await repository.FetchMultipleAsync<RequestModel, string, GetBettypeForRequestModel>(criteriaArchived);
        foreach (var request in requests)
        {
            request.BettypeNames = GetListBettypeName(request, betTypeForRequests);
        }

        return (requests, requestInfoGetCalcTime);
    }

    private IEnumerable<string> GetListBettypeName(RequestModel request, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.BetId, BetTypeId = x.Bettype }));
    }
}