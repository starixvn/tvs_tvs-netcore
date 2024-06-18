using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;

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
        var transInfoJsonList = await GetTransInfoJson(request);
        var criteria = GetCheckValidTransIdsCriteria(request, transInfoJsonList);

        var (matchInfoAddRequests, validationAbnormalBets, transInfoAddRequestModels, transInfoJsonOutputList, abnormalBetTicketRequests, sendLetstalkModels) =
            await repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet, TransInfoAddRequestModel, string, GetAbnormalBetTicketModel, SendLetstalkModel>(criteria);

        var validation = validationAbnormalBets.FirstOrDefault();
        var transInfoAddRequest = transInfoAddRequestModels.FirstOrDefault();
        var transInfoJson = transInfoJsonOutputList.FirstOrDefault();

        var viewModel = new CheckValidTransIdsViewModel
        {
            Matches = matchInfoAddRequestService.UpdateDataFromRemotingRef(matchInfoAddRequests),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequest?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequest?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequest?.MarkTransIds,
                TransInfoJson = transInfoJson
            },
            AbnormalBetTicketRequests = mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(abnormalBetTicketRequests),
            SendLetstalkModels = sendLetstalkModels
        };

        return viewModel;
    }

    private static CheckValidTransIdsCriteria GetCheckValidTransIdsCriteria(CheckValidTransIdsModel message, IEnumerable<string> transInfoJsonList)
    {
        var criteria = new CheckValidTransIdsCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            ActionId = message.ActionId,
            FilterBy = message.FilterBy,
            SubIssueTypeId = message.SubIssueTypeId,
            IsRemoveCustomerClass201 = message.IsRemoveCustomerClass201,
            IsRemoveCustomerClass4K = message.IsRemoveCustomerClass4K,
            IsAddSettledTickets = message.IsAddSettledTickets,
            IsVoidAllArchivedTickets = message.IsVoidAllArchivedTickets,
            TransInfoJson = string.Join(",", transInfoJsonList)
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckValidTransIdsModel model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = model.IssueTypeId,
            AbnormalBetModel = new AbnormalBetViewModel { TransIds = model.TransIds }
        };
        var transInfoJsonList = await getTransInfoService.GetTransInfoJson(getTransInfoQuery);

        return transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x));
    }
}