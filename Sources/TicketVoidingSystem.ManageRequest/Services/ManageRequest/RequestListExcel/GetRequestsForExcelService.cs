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

    public GetRequestsForExcelServiceImp(IMapper mapper, GetRequestsService getRequestsService,
        CalculateTimeService calculateTimeService, RenderRequestService renderService, ConvertRequestsService convertRequestsService)
    {
        this.mapper = mapper;
        this.getRequestsService = getRequestsService;
        this.calculateTimeService = calculateTimeService;
        this.renderService = renderService;
        this.convertRequestsService = convertRequestsService;
    }

    public async Task<IEnumerable<ExcelRequestModel>> GetRequestsExcel(SelectRequestsQuery query)
    {
        var models = await GetRawRequestsData(query);
        var viewModels = models.Select(renderService.RenderExportExcel);
        var issueTypes = await convertRequestsService.GetAllIssueTypes();
        var subIssueTypes = await convertRequestsService.GetAllSubIssueTypes();
        var voidActions = await convertRequestsService.GetAllVoidActions();
        var outputRequests = new List<ExcelRequestModel>();
        int? index = 0;

        foreach (var item in viewModels)
        {
            int? numberOfRequestDetail = null;
            int? currentIndex = null;
            var isCurrentRequestNotExistedInOutputRequests = outputRequests.All(x => x.RequestId != item.RequestId);
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
        var outputRequests = AssignCalcTime(requests, calculateTimeSets);
        return outputRequests.OrderByDescending(x => x.RequestId);
    }

    private static IEnumerable<RequestModel> AssignCalcTime(IEnumerable<RequestModel> inputRequests, IEnumerable<GetCalculateTimeModel> calculateTimeSets)
    {
        var requestIds = calculateTimeSets.Select(model => model.RequestId);
        foreach (var request in inputRequests)
        {
            if (requestIds.Contains(request.RequestId))
            {
                var calcTime = calculateTimeSets.First(model => model.RequestId == request.RequestId);
                request.CalcHalfTime = calcTime.CalcHalfTime;
                request.CalcFullTime = calcTime.CalcFullTime;
            }

            yield return request;
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
        outputRequest.NoOfTickets = convertRequestsService.GetNoOfTickets(param.CurrentViewModel.Details[0].TotalVoidedSingle, param.CurrentViewModel.Details[0].TotalVoidedParlay);
        outputRequest.NumberOfRequestDetails = param.NumberOfRequestDetail;
        outputRequest.CalcFullTime = param.CurrentViewModel.CalcFullTime != null ? param.CurrentViewModel.CalcFullTime.ToString() : string.Empty;
        outputRequest.CalcHalfTime = param.CurrentViewModel.CalcHalfTime != null ? param.CurrentViewModel.CalcHalfTime.ToString() : string.Empty;
        outputRequest.Index = param.CurrentIndex;
        return outputRequest;
    }
}