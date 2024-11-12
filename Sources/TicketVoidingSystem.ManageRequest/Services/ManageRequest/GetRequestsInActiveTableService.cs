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

public class GetRequestsInActiveTableServiceImp(
    IDynamicRepository repository,
    IMapper mapper,
    BetListService betListService)
    : GetRequestsInActiveTableService
{
    public async Task<(IEnumerable<RequestModel>, IEnumerable<string>)> GetRequestsInActiveTable(SelectRequestsQuery query)
    {
        var criteriaActive = mapper.Map<SelectActiveRequestsCriteria>(query);
        var (requests, requestInfoJson, requestInfoGetCalcTime, betTypeForRequests) =
            await repository.FetchMultipleAsync<RequestModel, string, string, GetBettypeForRequestModel>(criteriaActive);

        var totalVoidedTicketModels = await GetTotalVoidedTickets(requestInfoJson.First());
        foreach (var request in requests)
        {
            request.TotalSingleProcessed = GetTotalVoidedSingle(request, totalVoidedTicketModels);
            request.TotalParlayProcessed = GetTotalVoidedParlay(request, totalVoidedTicketModels);
            request.TotalCancelCashOutProcessed = GetTotalCancelCashOut(request, totalVoidedTicketModels);
            request.TotalResettleProcessed = GetTotalResettled(request, totalVoidedTicketModels);
            request.BettypeNames = GetListBettypeName(request, betTypeForRequests);
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

    private static int GetTotalVoidedSingle(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels)
    {
        return IsHaveMultipleMatches(request)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalSingleProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalSingleProcessed).Sum();
    }

    private static int GetTotalVoidedParlay(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels)
    {
        return IsHaveMultipleMatches(request)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalParlayProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalParlayProcessed).Sum();
    }

    private static int GetTotalCancelCashOut(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels)
    {
        return IsHaveMultipleMatches(request)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalCancelCashOutProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalCancelCashOutProcessed).Sum();
    }

    private static int GetTotalResettled(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels)
    {
        return IsHaveMultipleMatches(request)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalResettleProcessed).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalResettleProcessed).Sum();
    }

    private IEnumerable<string> GetListBettypeName(RequestModel request, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.BetId, BetTypeId = x.Bettype }));
    }

    private static bool IsHaveMultipleMatches(RequestModel request)
    {
        return IsSimpleMatch(request.IssueTypeId) || IsConditionalMatch(request.IssueTypeId, request.FilterBy);
    }

    private static bool IsSimpleMatch(int issueTypeId)
    {
        return SimpleMatchIssueTypes.Contains(issueTypeId);
    }

    private static bool IsConditionalMatch(int issueTypeId, object filterBy)
    {
        return issueTypeId == IssueTypeConstant.AbnormalBet && filterBy is null;
    }

    private static readonly HashSet<int> SimpleMatchIssueTypes = new()
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
}