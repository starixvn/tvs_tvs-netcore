using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
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
            request.TotalSingleProcessed = GetTotalProcessed(request, totalVoidedTicketModels, x => x.TotalSingleProcessed);
            request.TotalParlayProcessed = GetTotalProcessed(request, totalVoidedTicketModels, x => x.TotalParlayProcessed);
            request.TotalCancelCashOutProcessed = GetTotalProcessed(request, totalVoidedTicketModels, x => x.TotalCancelCashOutProcessed);
            request.TotalResettleProcessed = GetTotalProcessed(request, totalVoidedTicketModels, x => x.TotalResettleProcessed);
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

    private static int GetTotalProcessed(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, Func<GetRequestInfoModel, int> selector)
    {
        var filteredRequestInfo = totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId);

        filteredRequestInfo = request switch
        {
            _ when IsDifferenceByMatchId(request) =>
                filteredRequestInfo.Where(x => x.MatchId == request.MatchId),

            _ when IsDifferenceByRequestDetailId(request) =>
                filteredRequestInfo.Where(x => x.RequestDetailId == request.RequestDetailId),

            _ => filteredRequestInfo
        };

        return filteredRequestInfo.Sum(selector);
    }

    private IEnumerable<string> GetListBettypeName(RequestModel request, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.BetId, BetTypeId = x.Bettype }));
    }

    private static bool IsDifferenceByRequestDetailId(RequestModel request)
    {
        return request.IssueTypeId.IsWrongMarketOffered();
    }

    private static bool IsDifferenceByMatchId(RequestModel request)
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

    private static readonly HashSet<int> SimpleMatchIssueTypes =
    [
        IssueTypeConstant.DangerAccepted,
        IssueTypeConstant.WrongHDP,
        IssueTypeConstant.Wrong1stHDP,
        IssueTypeConstant.WrongOU,
        IssueTypeConstant.Wrong1stOU,
        IssueTypeConstant.RedCard,
        IssueTypeConstant.EarlyKickOffTime,
        IssueTypeConstant.WrongKickOffTime
    ];
}