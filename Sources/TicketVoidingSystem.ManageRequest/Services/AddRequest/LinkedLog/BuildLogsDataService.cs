using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface BuildLogsDataService
{
    IEnumerable<PoolHouseLinkedLogData> GenerateGroupPoolHouseLinkedLog(
        IEnumerable<PoolHouseLinkedLogResponse> resultFromApi, GetLinkedLogModel getLinkedLogModel);
}

public class BuildLogsDataServiceImp : BuildLogsDataService
{
    private readonly GetLinkedLogShowUiService getLinkedLogShowUiService;

    public BuildLogsDataServiceImp(GetLinkedLogShowUiService getLinkedLogShowUiService)
    {
        this.getLinkedLogShowUiService = getLinkedLogShowUiService;
    }

    public IEnumerable<PoolHouseLinkedLogData> GenerateGroupPoolHouseLinkedLog(IEnumerable<PoolHouseLinkedLogResponse> resultFromApi, GetLinkedLogModel getLinkedLogModel)
    {
        var linkedLogShowUi = getLinkedLogShowUiService.GetLinkedLogShowUi(getLinkedLogModel, resultFromApi);
        var poolHouseLinkedLogs = GeneratePoolHouseLinkedLog(linkedLogShowUi, getLinkedLogModel.IssueTypeId, getLinkedLogModel.SubIssueTypeId);
        return poolHouseLinkedLogs.GroupBy(x => x.GroupName)
            .Select(group => new PoolHouseLinkedLogData
            {
                GroupName = group.Key,
                LogsData = new List<string> { group.First().LogsData }
            });
    }

    private static IEnumerable<PoolHouseLinkedLogDataItem> GeneratePoolHouseLinkedLog(IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses, int issueTypeId, int subIssueTypeId)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x != null)
            .Select(response => new PoolHouseLinkedLogDataItem
            {
                GroupName = GetGroupName(response.LinkGroup),
                LogsData = BuildLogsData(response, issueTypeId, subIssueTypeId)
            });
    }

    private static string GetGroupName(int groupId)
    {
        return groupId switch
        {
            LinkedLogApiConstant.GroupId1X2 => "1X2",
            LinkedLogApiConstant.GroupIdAio => "AIO",
            LinkedLogApiConstant.GroupId1H1X2 => "1H 1X2",
            _ => string.Empty
        };
    }

    private static string BuildLogsData(PoolHouseLinkedLogResponse response, int issueTypeId, int subIssueTypeId)
    {
        var time = response.Time.ToString("MM/dd/yyyy hh:mm:ss tt");
        var score = $"Score[{response.HomeScore}:{response.AwayScore}]";
        var hdp = BuildHdp(response.LinkedOddsInfoDic, issueTypeId, subIssueTypeId);
        var ou = BuildOu(response.LinkedOddsInfoDic, issueTypeId, subIssueTypeId);

        return string.Join(", ", time, score, hdp, ou);
    }

    private static string BuildHdp(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDictionary, int issueTypeId, int subIssueTypeId)
    {
        var oddsInfoHdp = linkedOddsInfoDictionary.Values.FirstOrDefault(x => IsValidBetTypeBuildHdp(x, issueTypeId, subIssueTypeId));
        return oddsInfoHdp == null ? string.Empty : $"HDP[{oddsInfoHdp.Hdp1}:{oddsInfoHdp.Hdp2}]({oddsInfoHdp.Odds1a}:{oddsInfoHdp.Odds2a})";
    }

    private static string BuildOu(Dictionary<int, LinkedOddsInfo> linkedOddsInfoDictionary, int issueTypeId, int subIssueTypeId)
    {
        var oddsInfoOu = linkedOddsInfoDictionary.Values.FirstOrDefault(x => IsValidBetTypeBuildOu(x, issueTypeId, subIssueTypeId));
        return oddsInfoOu == null ? string.Empty : $"OU[{oddsInfoOu.Hdp1}]({oddsInfoOu.Odds1a}:{oddsInfoOu.Odds2a})";
    }

    private static bool IsValidBetTypeBuildHdp(LinkedOddsInfo linkedOddsInfo, int issueTypeId, int subIssueTypeId)
    {
        return issueTypeId switch
        {
            IssueTypeConstant.WrongHDP => linkedOddsInfo.BetType == BetTypeConstant.Handicap,
            IssueTypeConstant.WrongOU => linkedOddsInfo.BetType == BetTypeConstant.Handicap,
            IssueTypeConstant.Wrong1stHDP => linkedOddsInfo.BetType == BetTypeConstant.FirstHalfHandicap,
            IssueTypeConstant.Wrong1stOU => linkedOddsInfo.BetType == BetTypeConstant.FirstHalfHandicap,
            IssueTypeConstant.WrongOdds =>
                subIssueTypeId is SubIssueTypeConstant.Handicap or SubIssueTypeConstant.OverUnder
                    ? linkedOddsInfo.BetType == BetTypeConstant.Handicap
                    : linkedOddsInfo.BetType == BetTypeConstant.FirstHalfHandicap,
            _ => false
        };
    }

    private static bool IsValidBetTypeBuildOu(LinkedOddsInfo linkedOddsInfo, int issueTypeId, int subIssueTypeId)
    {
        return issueTypeId switch
        {
            IssueTypeConstant.WrongHDP => linkedOddsInfo.BetType == BetTypeConstant.OverUnder,
            IssueTypeConstant.WrongOU => linkedOddsInfo.BetType == BetTypeConstant.OverUnder,
            IssueTypeConstant.Wrong1stHDP => linkedOddsInfo.BetType == BetTypeConstant.FirstHalfOverUnder,
            IssueTypeConstant.Wrong1stOU => linkedOddsInfo.BetType == BetTypeConstant.FirstHalfOverUnder,
            IssueTypeConstant.WrongOdds =>
                subIssueTypeId is SubIssueTypeConstant.Handicap or SubIssueTypeConstant.OverUnder
                    ? linkedOddsInfo.BetType == BetTypeConstant.OverUnder
                    : linkedOddsInfo.BetType == BetTypeConstant.FirstHalfOverUnder,
            _ => false
        };
    }
}