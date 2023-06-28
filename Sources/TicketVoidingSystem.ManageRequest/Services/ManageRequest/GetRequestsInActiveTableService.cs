using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Utilities;

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
        var (requests, requestInfo, requestInfoGetCalcTime) = await repository.FetchMultipleAsync<RequestModel, GetRequestInfoModel, string>(criteriaActive);
        var totalVoidedTicketModels = GetTotalVoidedTickets(requestInfo);
        var betTypeForRequests = GetBettypeForAbnormalSingleRequest(requests);
        foreach (var request in requests)
        {
            request.TotalVoidedSingle = GetTotalVoidedSingle(request, totalVoidedTicketModels, request.IssueTypeId) ?? 0;
            request.TotalVoidedParlay = GetTotalVoidedParlay(request, totalVoidedTicketModels, request.IssueTypeId) ?? 0;
            request.TotalCancelCashOut = GetTotalCancelCashOut(request, totalVoidedTicketModels, request.IssueTypeId) ?? 0;
            request.BettypeNames = GetListBettypeName(request.RequestId, betTypeForRequests);
        }

        return (requests, requestInfoGetCalcTime);
    }

    private IEnumerable<GetBettypeForRequestModel> GetBettypeForAbnormalSingleRequest(IEnumerable<RequestModel> requests)
    {
        var requestXMLModel = requests.Where(x => Helper.IsAbnormalBetRealMember(x.IssueTypeId) || Helper.IsAbnormalBetSingleRequest(x.IssueTypeId, x.FilterBy))
            .Select(x => new RequestXMLModel { RequestId = x.RequestId, TransIds = x.TransIds });

        if (!requestXMLModel.Any())
        {
            return new List<GetBettypeForRequestModel>();
        }
        
        var criteria = new GetBettypeNamesCriteria { RequestInfo = requestXMLModel.ToRequestXml() };
        var models = repository.Fetch<GetBettypeForRequestModel>(criteria);
        return models;
    }

    private IEnumerable<GetRequestInfoModel> GetTotalVoidedTickets(IEnumerable<GetRequestInfoModel> requestInfo)
    {
        var totalVoidedTicketModels = new List<GetRequestInfoModel>();
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var criteria = new GetTotalVoidedTicketCriteria
            {
                SiteDbGroupId = item.Id,
                RequestInfo = requestInfo.ToRequestInfoGetVoidedTicketXml()
            };
            var response = repository.Fetch<GetRequestInfoModel>(criteria);

            totalVoidedTicketModels.AddRange(response);
        }

        return totalVoidedTicketModels;
    }

    private static int? GetTotalVoidedSingle(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalVoidedSingle).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalVoidedSingle).Sum();
    }

    private static int? GetTotalVoidedParlay(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalVoidedParlay).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalVoidedParlay).Sum();
    }

    private static int? GetTotalCancelCashOut(RequestModel request, IEnumerable<GetRequestInfoModel> totalVoidedTicketModels, int issueTypeId)
    {
        return IsHaveChildMatch(issueTypeId)
            ? totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId && x.MatchId == request.MatchId)
                .Select(y => y.TotalCancelCashOut).Sum()
            : totalVoidedTicketModels.Where(x => x.RequestId == request.RequestId).Select(y => y.TotalCancelCashOut).Sum();
    }

    private IEnumerable<string> GetListBettypeName(int requestId, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == requestId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.Betid, BetTypeId = x.Bettype }));
    }

    private static bool IsHaveChildMatch(int issueTypeId)
    {
        var issueTypesHaveChildMatch = new List<int>
        {
            IssueTypeConstant.DangerAccepted,
            IssueTypeConstant.WrongHDP,
            IssueTypeConstant.Wrong1stHDP,
            IssueTypeConstant.WrongOU,
            IssueTypeConstant.WrongOU,
        };

        return issueTypesHaveChildMatch.Contains(issueTypeId);
    }
}