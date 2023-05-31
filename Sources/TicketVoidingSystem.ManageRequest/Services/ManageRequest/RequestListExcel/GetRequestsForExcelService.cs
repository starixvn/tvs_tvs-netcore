using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface GetRequestsForExcelService
{
    Task<IEnumerable<ExcelRequestModel>> GetRequestsExcel(SelectRequestsQuery model);
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

    public async Task<IEnumerable<ExcelRequestModel>> GetRequestsExcel(SelectRequestsQuery model)
    {
        var (request, requestInfoGetCalcTimes) = await getRequestsService.GetRequests(model);
        var models = (await RenderDataRequest(request, requestInfoGetCalcTimes)).OrderByDescending(x => x.RequestId);
        var viewModels = models.Select(renderService.RenderExportExcel);
        var tickets = new List<ExcelRequestModel>();
        int? index = 1;
        foreach (var item in viewModels)
        {
            int? numberOfRequestDetail = viewModels.Count(x => x.RequestId == item.RequestId);
            if (tickets.Any(x => x.RequestId == item.RequestId))
            {
                numberOfRequestDetail = null;
                index--;
            }

            var ticket = mapper.Map<ExcelRequestModel>(item);
            ticket.MatchId = item.Details[0].MatchId.ToString();
            ticket.CalculatedScore = item.Details[0].SettlementStatus;
            ticket.Description = convertRequestsService.GetDescription(item.IssueTypeId, item.Details[0].Description);
            ticket.CreatedTime = item.CreatedDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
            ticket.IssueType = await convertRequestsService.GetIssueTypeName(item.IssueTypeId);
            ticket.SubIssueType = await convertRequestsService.GetSubIssueTypeName(item.SubIssueTypeId);
            ticket.Sport = convertRequestsService.GetSportName(item.Details[0].Description);
            ticket.Event = convertRequestsService.GetEvent(item.Details[0].Description);
            ticket.League = convertRequestsService.GetLeague(item.Details[0].Description);
            ticket.VarCheck = convertRequestsService.GetVarCheckValue(item.IsCheckedVar);
            ticket.BetType = string.Join(", ", item.BettypeNames);
            ticket.Action = await convertRequestsService.GetActionName(item.ActionId);
            ticket.PerformedBy = item.LastPerformedBy;
            ticket.NoOfTickets = convertRequestsService.GetNoOfTickets(item.Details[0].TotalVoidedSingle, item.Details[0].TotalVoidedParlay);
            ticket.NumberOfRequestDetails = numberOfRequestDetail;
            ticket.CalcFullTime = item.CalcFullTime != null ? item.CalcFullTime.ToString() : string.Empty;
            ticket.CalcHalfTime = item.CalcHalfTime != null ? item.CalcHalfTime.ToString() : string.Empty;
            ticket.Index = tickets.Any(x => x.RequestId == item.RequestId) ? null : index;
            tickets.Add(ticket);
            index++;
        }

        return tickets;
    }

    private async Task<IEnumerable<RequestModel>> RenderDataRequest(IEnumerable<RequestModel> requests, IEnumerable<string> query)
    {
        var calculateTimeSets = await calculateTimeService.GetCalculateTime(query);
        var data = new List<RequestModel>();
        foreach (var request in requests)
        {
            SetCalcTimeForRequest(calculateTimeSets, request);
            data.Add(request);
        }

        return data;
    }

    private void SetCalcTimeForRequest(IEnumerable<GetCalculateTimeModel> calculateTimeSets, RequestModel request)
    {
        if (calculateTimeSets.Select(model => model.RequestId).Contains(request.RequestId))
        {
            var calcTime = calculateTimeSets.First(model => model.RequestId == request.RequestId);
            request.CalcHalfTime = calcTime.CalcHalfTime;
            request.CalcFullTime = calcTime.CalcFullTime;
        }
    }
}