using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface GetLinkedLogService
{
    Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel);

    Task<LinkedLogDataViewModel> GetLinkedLogWhenError(Exception exception);
}

public class GetLinkedLogServiceImp : GetLinkedLogService
{
    private readonly LoggingService loggingService;
    private readonly LinkedLogHttpClientService linkedLogHttpClientService;
    private readonly FilterLinkedLogService filterLinkedLogService;
    private readonly LinkGroupBettypeService linkGroupBettypeService;
    private readonly LinkedLogForUIService linkedLogForUIService;

    public GetLinkedLogServiceImp(LoggingService loggingService,
        LinkedLogHttpClientService linkedLogHttpClientService,
        FilterLinkedLogService filterLinkedLogService,
        LinkGroupBettypeService linkGroupBettypeService,
        LinkedLogForUIService linkedLogForUIService
    )
    {
        this.loggingService = loggingService;
        this.linkedLogHttpClientService = linkedLogHttpClientService;
        this.filterLinkedLogService = filterLinkedLogService;
        this.linkGroupBettypeService = linkGroupBettypeService;
        this.linkedLogForUIService = linkedLogForUIService;
    }

    public async Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel)
    {
        var responseFromApi = await linkedLogHttpClientService.GetLinkedLog(getLinkedLogModel.MatchId, getLinkedLogModel.LiveIndicator);
        var groupLinkedLogResponse = filterLinkedLogService.GroupBy(getLinkedLogModel, responseFromApi);
        var (isLinkGroup1X2, isLinkGroupAIO) = linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, groupLinkedLogResponse.AffectedLog);
        var groupLinkedLogs = linkedLogForUIService.Build(groupLinkedLogResponse, getLinkedLogModel.IssueTypeId, getLinkedLogModel.SubIssueTypeId);

        return new LinkedLogDataViewModel
        {
            GroupLinkedLogs = groupLinkedLogs,
            IsLinkGroup1X2 = isLinkGroup1X2,
            IsLinkGroupAIO = isLinkGroupAIO,
            Result = new Result
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty
            }
        };
    }

    public async Task<LinkedLogDataViewModel> GetLinkedLogWhenError(Exception exception)
    {
        await loggingService.ErrorAsync("TicketVoidingSystem.ManageRequest.Services.LinkedLog.CallGetLinkedLog", exception);
        return new LinkedLogDataViewModel
        {
            Result = new Result
            {
                ErrorCode = 1,
                ErrorMsg = "Cannot get link log"
            }
        };
    }
}