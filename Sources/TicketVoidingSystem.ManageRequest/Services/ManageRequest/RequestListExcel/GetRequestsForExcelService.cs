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
            AssignTVAndIPTV(request, owpData, owpMatchIds);

            yield return request;
        }
    }

    private static void AssignCalcTime(RequestModel request, IEnumerable<GetCalculateTimeModel> calculateTimeSets, IEnumerable<int> requestIdsHaveData)
    {
        if (requestIdsHaveData.Contains(request.RequestId))
        {
            var calcTime = calculateTimeSets.First(model => model.RequestId == request.RequestId && model.MatchId == request.MatchId);
            request.CalcHalfTime = calcTime.CalcHalfTime;
            request.CalcFullTime = calcTime.CalcFullTime;
        }
    }

    private static void AssignTVAndIPTV(RequestModel request, IEnumerable<OWPData> owpData, IEnumerable<int> matchIdsHaveData)
    {
        var owpDataOfCurrentMatch = request.MatchId is not null && matchIdsHaveData.Contains(request.MatchId.Value)
            ? owpData.First(x => x.MatchId == request.MatchId.Value) : null;
        var owpDataOfParentMatch = request.ParentMatchId is not null && request.ParentMatchId > 0 && matchIdsHaveData.Contains(request.ParentMatchId.Value)
            ? owpData.First(x => x.MatchId == request.ParentMatchId.Value) : null;

        var currentOWPdata = owpDataOfCurrentMatch ?? owpDataOfParentMatch;
        if (currentOWPdata is not null)
        {
            request.TVAndIPTV = $"{currentOWPdata.TV}\n{currentOWPdata.IPTV}";
        }
    }

    private ExcelRequestModel MapToExcelRequestModel(ExcelRequestsMappingParameter param)
    {
        var outputRequest = mapper.Map<ExcelRequestModel>(param.CurrentViewModel);
        outputRequest.MatchId = param.CurrentViewModel.Details[0].MatchId?.ToString();
        if (param.CurrentViewModel.Details[0].MatchId is not null && param.CurrentViewModel.Details[0].MatchId != BetTypeConstant.SystemParlay)
        {
            outputRequest.EventDateMatch = param.CurrentViewModel.Details[0].EventDateMatch.ToString(FormatKey.ShortDateFormatWithHyphen);
            outputRequest.KickOffTimeMatch = param.CurrentViewModel.Details[0].KickOffTimeMatch.ToString(FormatKey.OnlyTimeWithPeriodFormat);
        }

        outputRequest.Trader = param.CurrentViewModel.Details[0].Trader;
        outputRequest.LA = param.CurrentViewModel.Details[0].LA;
        outputRequest.Remark = param.CurrentViewModel.Details[0].Remark;
        outputRequest.TVAndIPTV = param.CurrentViewModel.Details[0].TVAndIPTV;
        outputRequest.Provider = param.CurrentViewModel.Details[0].Provider;
        outputRequest.Source = param.CurrentViewModel.Details[0].Source;
        outputRequest.Message = param.CurrentViewModel.Details[0].Message;

        outputRequest.CalculatedScore = param.CurrentViewModel.Details[0].SettlementStatus;
        outputRequest.Description = convertRequestsService.GetDescription(param.CurrentViewModel.IssueTypeId, param.CurrentViewModel.Details[0].Description);
        outputRequest.Sport = convertRequestsService.GetSportName(param.CurrentViewModel.Details[0].Description);
        outputRequest.Event = convertRequestsService.GetEvent(param.CurrentViewModel.Details[0].Description);
        outputRequest.League = convertRequestsService.GetLeague(param.CurrentViewModel.Details[0].Description);
        outputRequest.NoOfTickets = convertRequestsService.GetNoOfTickets(param.CurrentViewModel.Details[0].TotalSingleProcessed, param.CurrentViewModel.Details[0].TotalParlayProcessed);
        outputRequest.CreatedTime = param.CurrentViewModel.CreatedDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        outputRequest.IssueType = convertRequestsService.GetIssueTypeName(param.CurrentViewModel.IssueTypeId, param.IssueTypes);
        outputRequest.SubIssueType = convertRequestsService.GetSubIssueTypeName(param.CurrentViewModel.SubIssueTypeId, param.SubIssueTypes);
        outputRequest.VarCheck = convertRequestsService.GetVarCheckValue(param.CurrentViewModel.IsCheckedVar);
        outputRequest.BetType = string.Join(", ", param.CurrentViewModel.BettypeNames);
        outputRequest.Action = convertRequestsService.GetVoidActionName(param.CurrentViewModel.ActionId, param.VoidActions);
        outputRequest.PerformedBy = param.CurrentViewModel.LastPerformedBy;
        outputRequest.NumberOfRequestDetails = param.NumberOfRequestDetail;
        outputRequest.CalcFullTime = param.CurrentViewModel.CalcFullTime != null ? param.CurrentViewModel.CalcFullTime.ToString() : string.Empty;
        outputRequest.CalcHalfTime = param.CurrentViewModel.CalcHalfTime != null ? param.CurrentViewModel.CalcHalfTime.ToString() : string.Empty;
        outputRequest.Index = param.CurrentIndex;
        return outputRequest;
    }
}