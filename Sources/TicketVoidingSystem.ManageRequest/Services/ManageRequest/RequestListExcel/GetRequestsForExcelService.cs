using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Models.Parameters;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface GetRequestsForExcelService
{
    Task<IEnumerable<ExcelRequestModel>> GetRequestsExcel(SelectRequestsQuery query);
}

public class GetRequestsForExcelServiceImp : GetRequestsForExcelService
{
    private readonly IMapper mapper;
    private readonly GetRequestsService getRequestsService;
    private readonly CalculateTimeService calculateTimeService;
    private readonly RenderRequestService renderService;
    private readonly ConvertRequestsService convertRequestsService;
    private readonly OWPDataService owpDataService;

    public GetRequestsForExcelServiceImp(IMapper mapper, GetRequestsService getRequestsService, CalculateTimeService calculateTimeService,
        RenderRequestService renderService, ConvertRequestsService convertRequestsService, OWPDataService owpDataService)
    {
        this.mapper = mapper;
        this.getRequestsService = getRequestsService;
        this.calculateTimeService = calculateTimeService;
        this.renderService = renderService;
        this.convertRequestsService = convertRequestsService;
        this.owpDataService = owpDataService;
    }

    public async Task<IEnumerable<ExcelRequestModel>> GetRequestsExcel(SelectRequestsQuery query)
    {
        var models = await GetRawRequestsData(query);
        var viewModels = models.Select(renderService.RenderExportExcel).ToList();
        var issueTypes = await convertRequestsService.GetAllIssueTypes();
        var subIssueTypes = await convertRequestsService.GetAllSubIssueTypes();
        var voidActions = await convertRequestsService.GetAllVoidActions();
        var outputRequests = new List<ExcelRequestModel>();
        int? index = 0;

        foreach (var item in viewModels)
        {
            int? numberOfRequestDetail = null;
            int? currentIndex = null;
            var isCurrentRequestNotExistedInOutputRequests = outputRequests.TrueForAll(x => x.RequestId != item.RequestId);
            if (isCurrentRequestNotExistedInOutputRequests)
            {
                numberOfRequestDetail = viewModels.Count(x => x.RequestId == item.RequestId);
                index++;
                currentIndex = index;
            }

            var mappingParam = new ExcelRequestsMappingParameter
            {
                CurrentViewModel = item,
                CurrentIndex = currentIndex,
                NumberOfRequestDetail = numberOfRequestDetail,
                IssueTypes = issueTypes,
                SubIssueTypes = subIssueTypes,
                VoidActions = voidActions
            };
            var outputRequest = MapToExcelRequestModel(mappingParam);
            outputRequests.Add(outputRequest);
        }

        return outputRequests;
    }

    private async Task<IEnumerable<RequestModel>> GetRawRequestsData(SelectRequestsQuery query)
    {
        var (requests, requestInfoGetCalcTimes) = await getRequestsService.GetRequests(query);
        var calculateTimeSets = await calculateTimeService.GetCalculateTime(requestInfoGetCalcTimes);
        var owpData = await owpDataService.GetIPTV(requests);
        var outputRequests = AssignExtraInfo(requests, calculateTimeSets, owpData);
        return outputRequests.OrderByDescending(x => x.RequestId);
    }

    private static IEnumerable<RequestModel> AssignExtraInfo(IEnumerable<RequestModel> inputRequests, IEnumerable<GetCalculateTimeModel> calculateTimeSets, IEnumerable<OWPData> owpData)
    {
        var requestIds = calculateTimeSets.Select(model => model.RequestId);
        var owpMatchIds = owpData.Select(x => x.MatchId);
        foreach (var request in inputRequests)
        {
            AssignCalcTime(request, calculateTimeSets, requestIds);
            AssignIPTV(request, owpData, owpMatchIds);

            yield return request;
        }
    }

    private static void AssignCalcTime(RequestModel request, IEnumerable<GetCalculateTimeModel> calculateTimeSets, IEnumerable<int> requestIdsHaveData)
    {
        if (requestIdsHaveData.Contains(request.RequestId))
        {
            var calcTime = calculateTimeSets.First(model => model.RequestId == request.RequestId);
            request.CalcHalfTime = calcTime.CalcHalfTime;
            request.CalcFullTime = calcTime.CalcFullTime;
        }
    }

    private static void AssignIPTV(RequestModel request, IEnumerable<OWPData> owpData, IEnumerable<int> matchIdsHaveData)
    {
        if (request.MatchId is not null && matchIdsHaveData.Contains(request.MatchId.Value))
        {
            request.IPTV = owpData.First(x => x.MatchId == request.MatchId.Value).IPTV;
        }
    }

    private ExcelRequestModel MapToExcelRequestModel(ExcelRequestsMappingParameter param)
    {
        var outputRequest = mapper.Map<ExcelRequestModel>(param.CurrentViewModel);
        outputRequest.MatchId = param.CurrentViewModel.Details[0].MatchId?.ToString();
        outputRequest.CalculatedScore = param.CurrentViewModel.Details[0].SettlementStatus;
        outputRequest.Description = convertRequestsService.GetDescription(param.CurrentViewModel.IssueTypeId, param.CurrentViewModel.Details[0].Description);
        outputRequest.CreatedTime = param.CurrentViewModel.CreatedDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        outputRequest.IssueType = convertRequestsService.GetIssueTypeName(param.CurrentViewModel.IssueTypeId, param.IssueTypes);
        outputRequest.SubIssueType = convertRequestsService.GetSubIssueTypeName(param.CurrentViewModel.SubIssueTypeId, param.SubIssueTypes);
        outputRequest.Sport = convertRequestsService.GetSportName(param.CurrentViewModel.Details[0].Description);
        outputRequest.Event = convertRequestsService.GetEvent(param.CurrentViewModel.Details[0].Description);
        outputRequest.League = convertRequestsService.GetLeague(param.CurrentViewModel.Details[0].Description);
        outputRequest.VarCheck = convertRequestsService.GetVarCheckValue(param.CurrentViewModel.IsCheckedVar);
        outputRequest.BetType = string.Join(", ", param.CurrentViewModel.BettypeNames);
        outputRequest.Action = convertRequestsService.GetVoidActionName(param.CurrentViewModel.ActionId, param.VoidActions);
        outputRequest.PerformedBy = param.CurrentViewModel.LastPerformedBy;
        outputRequest.NoOfTickets = convertRequestsService.GetNoOfTickets(param.CurrentViewModel.Details[0].TotalSingleProcessed, param.CurrentViewModel.Details[0].TotalParlayProcessed);
        outputRequest.NumberOfRequestDetails = param.NumberOfRequestDetail;
        outputRequest.CalcFullTime = param.CurrentViewModel.CalcFullTime != null ? param.CurrentViewModel.CalcFullTime.ToString() : string.Empty;
        outputRequest.CalcHalfTime = param.CurrentViewModel.CalcHalfTime != null ? param.CurrentViewModel.CalcHalfTime.ToString() : string.Empty;
        outputRequest.Index = param.CurrentIndex;
        return outputRequest;
    }
}