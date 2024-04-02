using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestsInActiveTableService
{
    Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequestsInActiveTable(SelectRequestsQuery query);
}

public class GetRequestsInActiveTableServiceImp : GetRequestsInActiveTableService
{
    private readonly IDynamicRepository repository;
    private readonly IMapper mapper;
    private readonly BetListService betListService;

    public GetRequestsInActiveTableServiceImp(IDynamicRepository repository, IMapper mapper, BetListService betListService)
    {
        this.repository = repository;
        this.mapper = mapper;
        this.betListService = betListService;
    }

    public async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequestsInActiveTable(SelectRequestsQuery query)
    {
        var criteriaActive = mapper.Map<SelectActiveRequestsCriteria>(query);
        var mappingTypes = new[] { typeof(RequestModel), typeof(string), typeof(string), typeof(GetBettypeForRequestModel) };
        var result = await repository.FetchMultipleAsync(criteriaActive, mappingTypes);
        var requests = result[0].Cast<RequestModel>();
        var requestInfoJson = result[1].Cast<string>();
        var requestInfoGetCalcTime = result[2].Cast<string>();
        var betTypeForRequests = result[3].Cast<GetBettypeForRequestModel>();

        var totalVoidedTicketModels = await GetTotalVoidedTickets(requestInfoJson.First());
        foreach (var request in requests)
        {
            request.TotalSingleProcessed = GetTotalVoidedSingle(request, totalVoidedTicketModels, request.IssueTypeId);
            request.TotalParlayProcessed = GetTotalVoidedParlay(request, totalVoidedTicketModels, request.IssueTypeId);
            request.TotalCancelCashOutProcessed = GetTotalCancelCashOut(request, totalVoidedTicketModels, request.IssueTypeId);
            request.TotalResettleProcessed = GetTotalResettled(request, totalVoidedTicketModels, request.IssueTypeId);
            request.BettypeNames = GetListBettypeName(request.RequestId, betTypeForRequests);
        }

        return (requests, requestInfoGetCalcTime);
    }

    private async Task<IEnumerable<GetRequestInfoModel>> GetTotalVoidedTickets(string requestInfoJson)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = new GetTotalVoidedTicketCriteria
            {
                SiteDbGroupId = server.Id,
                RequestInfo = requestInfoJson
            };
            return repository.FetchAsync<GetRequestInfoModel>(criteria);
        });
        var results = await Task.WhenAll(tasks);

        return results.SelectMany(item => item);
    }

    private static int GetTotalVoidedSingle(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalSingleProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalSingleProcessed).Sum();
    }

    private static int GetTotalVoidedParlay(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalParlayProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalParlayProcessed).Sum();
    }

    private static int GetTotalCancelCashOut(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalCancelCashOutProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalCancelCashOutProcessed).Sum();
    }

    private static int GetTotalResettled(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalResettleProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalResettleProcessed).Sum();
    }

    private IEnumerable<string> GetListBettypeName(int requestId, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == requestId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.BetId, BetTypeId = x.Bettype }));
    }

    private static bool IsHaveChildMatch(int issueTypeId)
    {
        var issueTypesHaveChildMatch = new List<int>
        {
            IssueTypeConstant.DangerAccepted,
            IssueTypeConstant.WrongHDP,
            IssueTypeConstant.Wrong1stHDP,
            IssueTypeConstant.WrongOU,
            IssueTypeConstant.Wrong1stOU,
            IssueTypeConstant.RedCard,
            IssueTypeConstant.EarlyKickOffTime,
            IssueTypeConstant.WrongKickOffTime
        };

        return issueTypesHaveChildMatch.Contains(issueTypeId);
    }
}