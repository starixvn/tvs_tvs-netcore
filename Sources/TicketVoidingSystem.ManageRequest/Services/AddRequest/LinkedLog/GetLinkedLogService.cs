using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface GetLinkedLogService
{
    Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel);

    Task<LinkedLogDataViewModel> GetLinkedLogWhenError(Exception exception);
}

public class GetLinkedLogServiceImp(
    LoggingService loggingService,
    LinkedLogHttpClientService linkedLogHttpClientService,
    FilterLinkedLogService filterLinkedLogService,
    LinkGroupBettypeService linkGroupBettypeService,
    LinkedLogForUIService linkedLogForUiService)
    : GetLinkedLogService
{
    public async Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel)
    {
        var responseFromApi = await linkedLogHttpClientService.GetLinkedLog(getLinkedLogModel.MatchId, getLinkedLogModel.LiveIndicator);
        var groupLinkedLogResponse = filterLinkedLogService.GroupBy(getLinkedLogModel, responseFromApi);
        var (isLinkGroup1X2, isLinkGroupAIO) = linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, groupLinkedLogResponse.AffectedLog);
        var groupLinkedLogs = linkedLogForUiService.Build(groupLinkedLogResponse, getLinkedLogModel.IssueTypeId, getLinkedLogModel.SubIssueTypeId);

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
            IsLinkGroup1X2 = true,
            IsLinkGroupAIO = true,
            Result = new Result
            {
                ErrorCode = 1,
                ErrorMsg = "Cannot get link log"
            }
        };
    }
}