using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLinkedLogService
{
    Task<LinkedLogDataViewModel> GetLinkedLog(GetLinkedLogModel getLinkedLogModel);
}

public class GetLinkedLogServiceImp : GetLinkedLogService
{
    private readonly LoggingService loggingService;
    private readonly LinkedLogApiService linkedLogApiService;
    private readonly ValidationLinkedLogService validationService;
    private readonly BuildLogsDataService buildLogsDataService;
    private readonly GetLinkedLogCheckValidationService getLinkedLogCheckValidationService;

    public GetLinkedLogServiceImp(LoggingService loggingService,
        LinkedLogApiService linkedLogApiService,
        ValidationLinkedLogService validationService,
        BuildLogsDataService buildLogsDataService,
        GetLinkedLogCheckValidationService getLinkedLogCheckValidationService
        )
    {
        this.loggingService = loggingService;
        this.linkedLogApiService = linkedLogApiService;
        this.validationService = validationService;
        this.buildLogsDataService = buildLogsDataService;
        this.getLinkedLogCheckValidationService = getLinkedLogCheckValidationService;
    }

    public async Task<LinkedLogDataViewModel> GetLinkedLog(GetLinkedLogModel getLinkedLogModel)
    {
        var defaultLogData = GetDefaultLogData(getLinkedLogModel);
        try
        {
            var resultFromApi = await linkedLogApiService.GetLinkedLog(getLinkedLogModel);
            var linkedLogCheckValidate = getLinkedLogCheckValidationService.GetLinkedLogCheckValidate(getLinkedLogModel, resultFromApi);
            var isLinkGroup1X2 = validationService.CheckAffectedToGroup(LinkedLogApiConstant.GroupId1X2, getLinkedLogModel, linkedLogCheckValidate);
            var isLinkGroup1H1X2 = validationService.CheckAffectedToGroup(LinkedLogApiConstant.GroupId1H1X2, getLinkedLogModel, linkedLogCheckValidate);
            var isLinkGroupAIO = validationService.CheckAffectedToGroup(LinkedLogApiConstant.GroupIdAio, getLinkedLogModel, linkedLogCheckValidate);
            var groupPoolHouseLinkedLog
                = buildLogsDataService.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel);

            return new LinkedLogDataViewModel
            {
                PoolHouseLinkedLogsData = groupPoolHouseLinkedLog.Any() ? groupPoolHouseLinkedLog : defaultLogData,
                IsLinkGroup1X2 = validationService.CheckAffectedToGroup1X2(getLinkedLogModel, isLinkGroup1X2, isLinkGroup1H1X2),
                IsLinkGroupAIO = isLinkGroupAIO,
                Result = new Result
                {
                    ErrorCode = 0,
                    ErrorMsg = string.Empty
                }
            };
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync("TicketVoidingSystem.ManageRequest.Services.LinkedLog.CallGetLinkedLog", exception);
            return new LinkedLogDataViewModel
            {
                PoolHouseLinkedLogsData = defaultLogData,
                Result = new Result
                {
                    ErrorCode = 1,
                    ErrorMsg = "Cannot get link log"
                }
            };
        }
    }

    private static IEnumerable<PoolHouseLinkedLogData> GetDefaultLogData(GetLinkedLogModel getLinkedLogModel)
    {
        return new List<PoolHouseLinkedLogData>
            {
                new() { GroupName = GetGroupNameDefaultLogData(getLinkedLogModel) },
                new() { GroupName = "AIO" }
            };
    }

    private static string GetGroupNameDefaultLogData(GetLinkedLogModel getLinkedLogModel)
    {
        switch (getLinkedLogModel.IssueTypeId)
        {
            case IssueTypeConstant.WrongHDP:
            case IssueTypeConstant.WrongOU:
                return "1X2";

            case IssueTypeConstant.Wrong1stHDP:
            case IssueTypeConstant.Wrong1stOU:
                return "1H 1X2";

            case IssueTypeConstant.WrongOdds:
                return getLinkedLogModel.SubIssueTypeId == SubIssueTypeConstant.Handicap ||
                       getLinkedLogModel.SubIssueTypeId == SubIssueTypeConstant.OverUnder
                    ? "1X2"
                    : "1H 1X2";

            default:
                return string.Empty;
        }
    }
}