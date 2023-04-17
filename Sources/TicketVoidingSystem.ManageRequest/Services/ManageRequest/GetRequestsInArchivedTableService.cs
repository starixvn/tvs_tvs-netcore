using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestsInArchivedTableService
{
    Task<IEnumerable<RequestModel>> GetRequestsInArchivedTable(SelectRequestsQuery query);
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

    public async Task<IEnumerable<RequestModel>> GetRequestsInArchivedTable(SelectRequestsQuery query)
    {
        var criteriaArchived = mapper.Map<SelectArchivedRequestsCriteria>(query);
        var models = await repository.FetchAsync<RequestModel>(criteriaArchived);
        var bettypeForRequests = GetBettypeForAbnormalSingleRequestArchive(models);
        foreach (var model in models)
        {
            model.BettypeNames = GetListBettypeName(model.RequestId, bettypeForRequests);
        }

        return models;
    }

    private IEnumerable<GetBettypeForRequestModel> GetBettypeForAbnormalSingleRequestArchive(IEnumerable<RequestModel> requests)
    {
        var requestXMLModel = requests.Where(x => Helper.IsAbnormalBetRealMember(x.IssueTypeId) || Helper.IsAbnormalBetSingleRequest(x.IssueTypeId, x.FilterBy))
            .Select(x => new RequestXMLModel { RequestId = x.RequestId, TransIds = x.TransIds });

        if (!requestXMLModel.Any())
        {
            return new List<GetBettypeForRequestModel>();
        }
        else
        {
            var criteria = new GetBettypeNamesArchiveCriteria { RequestInfo = requestXMLModel.ToRequestXml() };
            var models = repository.Fetch<GetBettypeForRequestModel>(criteria);
            return models;
        }
    }

    private IEnumerable<string> GetListBettypeName(int requestId, IEnumerable<GetBettypeForRequestModel> bettypeForRequests)
    {
        return bettypeForRequests.Where(x => x.RequestId == requestId)
            .Select(x => betListService.GetBetTypeName(new Ticket { BetId = x.Betid, BetTypeId = x.Bettype }));
    }
}