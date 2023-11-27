using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;
public interface CheckValidTransIdsService
{
    Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request);
}

public class CheckValidTransIdsServiceImp : CheckValidTransIdsService
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly MapAbnormalBetTicketsExcelService mapTicketsExcelService;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly IDynamicRepository repository;

    public CheckValidTransIdsServiceImp(IDynamicRepository repository,
        MatchInfoAddRequestService matchInfoAddRequestService,
        GetTransInfoService getTransInfoService, MapAbnormalBetTicketsExcelService mapTicketsExcelService)
    {
        this.repository = repository;
        this.matchInfoAddRequestService = matchInfoAddRequestService;
        this.getTransInfoService = getTransInfoService;
        this.mapTicketsExcelService = mapTicketsExcelService;
    }

    public async Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request)
    {
        var criteria = await GetCheckValidTransIdsCriteria(request);
        var mappingTypes = new[]
        {
            typeof(MatchInfoAddRequest), typeof(ValidationAbnormalBet), typeof(TransInfoAddRequestModel),
            typeof(string),
            typeof(GetAbnormalBetTicketModel)
        };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes);
        var match = result[0].Cast<MatchInfoAddRequest>().FirstOrDefault();
        var validation = result[1].Cast<ValidationAbnormalBet>().FirstOrDefault();
        var transInfoAddRequestModel = result[2].Cast<TransInfoAddRequestModel>().FirstOrDefault();
        var transInfoJson = result[3].Cast<string>().FirstOrDefault();
        var abnormalBetTicketRequests = result[4].Cast<GetAbnormalBetTicketModel>();

        var viewModel = new CheckValidTransIdsViewModel
        {
            Match = matchInfoAddRequestService.UpdateDataFromRemotingRef(match),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequestModel?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequestModel?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequestModel?.MarkTransIds,
                TransInfoJson = transInfoJson
            },
            AbnormalBetTicketRequests =
                mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(abnormalBetTicketRequests)
        };

        return viewModel;
    }

    private async Task<CheckValidTransIdsCriteria> GetCheckValidTransIdsCriteria(CheckValidTransIdsModel message)
    {
        var transInfoJsonList = await GetTransInfoJson(message);
        var criteria = new CheckValidTransIdsCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            ActionId = message.ActionId,
            FilterBy = message.FilterBy,
            SubIssueTypeId = message.SubIssueTypeId,
            IsRemoveCustomerClass201 = message.IsRemoveCustomerClass201,
            IsRemoveCustomerClass4K = message.IsRemoveCustomerClass4K,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckValidTransIdsModel model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = model.IssueTypeId,
            TransIds = model.TransIds
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}