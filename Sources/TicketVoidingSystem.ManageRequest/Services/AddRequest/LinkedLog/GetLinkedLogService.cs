using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface GetLinkedLogService
{
    IEnumerable<PoolHouseLinkedLogData> GetDefaultLogData(GetLinkedLogModel getLinkedLogModel);

    Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel,
        IEnumerable<PoolHouseLinkedLogData> defaultLogData);

    Task<LinkedLogDataViewModel> GetLinkedLogWhenError(Exception exception,
        IEnumerable<PoolHouseLinkedLogData> defaultLogData);
}

public class GetLinkedLogServiceImp : GetLinkedLogService
{
    private readonly LoggingService loggingService;
    private readonly LinkedLogHttpClientService linkedLogHttpClientService;
    private readonly LinkGroupBettypeService linkGroupBettypeService;
    private readonly BuildLogsDataService buildLogsDataService;

    public GetLinkedLogServiceImp(LoggingService loggingService,
        LinkedLogHttpClientService linkedLogHttpClientService,
        LinkGroupBettypeService linkGroupBettypeService,
        BuildLogsDataService buildLogsDataService
    )
    {
        this.loggingService = loggingService;
        this.linkedLogHttpClientService = linkedLogHttpClientService;
        this.linkGroupBettypeService = linkGroupBettypeService;
        this.buildLogsDataService = buildLogsDataService;
    }

    public async Task<LinkedLogDataViewModel> GetLinkedLogWhenSuccess(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogData> defaultLogData)
    {
        var resultFromApi = await linkedLogHttpClientService.GetLinkedLog(new PoolHouseLinkedLogRequest
        {
            MatchId = getLinkedLogModel.MatchId,
            LiveIndicator = getLinkedLogModel.LiveIndicator
        });
        var linkGroupBettypeValidation = linkGroupBettypeService.CheckAffectedToGroup(getLinkedLogModel, resultFromApi);
        var groupPoolHouseLinkedLog = buildLogsDataService.GenerateGroupPoolHouseLinkedLog(resultFromApi, getLinkedLogModel);

        return new LinkedLogDataViewModel
        {
            PoolHouseLinkedLogsData = groupPoolHouseLinkedLog.Any() ? groupPoolHouseLinkedLog : defaultLogData,
            IsLinkGroup1X2 = linkGroupBettypeValidation.IsLinkGroup1X2,
            IsLinkGroupAIO = linkGroupBettypeValidation.IsLinkGroupAIO,
            Result = new Result
            {
                ErrorCode = 0,
                ErrorMsg = string.Empty
            }
        };
    }

    public async Task<LinkedLogDataViewModel> GetLinkedLogWhenError(Exception exception, IEnumerable<PoolHouseLinkedLogData> defaultLogData)
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

    public IEnumerable<PoolHouseLinkedLogData> GetDefaultLogData(GetLinkedLogModel getLinkedLogModel)
    {
        return new List<PoolHouseLinkedLogData>
            {
                new() { GroupName = GetGroupNameDefaultLogData(getLinkedLogModel) },
                new() { GroupName = "AIO" }
            };
    }

    private static string GetGroupNameDefaultLogData(GetLinkedLogModel getLinkedLogModel)
    {
        return getLinkedLogModel.IssueTypeId switch
        {
            IssueTypeConstant.WrongHDP => "1X2",
            IssueTypeConstant.WrongOU => "1X2",
            IssueTypeConstant.Wrong1stHDP => "1H 1X2",
            IssueTypeConstant.Wrong1stOU => "1H 1X2",
            IssueTypeConstant.WrongOdds => getLinkedLogModel.SubIssueTypeId is SubIssueTypeConstant.Handicap or SubIssueTypeConstant.OverUnder
                ? "1X2"
                : "1H 1X2",
            _ => string.Empty
        };
    }
}