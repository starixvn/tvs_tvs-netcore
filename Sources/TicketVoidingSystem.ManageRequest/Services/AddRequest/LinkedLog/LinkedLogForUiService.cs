using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkedLogForUIService
{
    IEnumerable<GroupLinkedLogUI> Build(GroupLinkedLogResponse groupLinkedLogResponse, int issueTypeId, int subIssueTypeId);
}

public class LinkedLogForUIServiceImp : LinkedLogForUIService
{
    public IEnumerable<GroupLinkedLogUI> Build(GroupLinkedLogResponse groupLinkedLogResponse, int issueTypeId, int subIssueTypeId)
    {
        var distinctLinkGroupIdAffected = groupLinkedLogResponse.AffectedLog.Select(x => x.LinkGroup).Distinct();
        var excludedNotAffectedLog = groupLinkedLogResponse.NotAffectedLog.Where(x => !distinctLinkGroupIdAffected.Contains(x.LinkGroup));

        var affectedGroups = BuildByLinkGroup(true, groupLinkedLogResponse.AffectedLog, issueTypeId, subIssueTypeId);
        var notAffectedGroups = BuildByLinkGroup(false, excludedNotAffectedLog, issueTypeId, subIssueTypeId);

        var allGroups = affectedGroups.Concat(notAffectedGroups).ToList();

        AddDefaultGroupForDisplay(allGroups, issueTypeId, subIssueTypeId);
        return allGroups;
    }

    private static IEnumerable<GroupLinkedLogUI> BuildByLinkGroup(bool isAffectedGroup, IEnumerable<PoolHouseLinkedLogResponse> responseLogs, int issueTypeId, int subIssueTypeId)
    {
        var groupedLogs = responseLogs.GroupBy(log => log.LinkGroup);

        return groupedLogs.Select(group =>
                group.Select(response => new GroupLinkedLogUI
                {
                    IsAffectedGroup = isAffectedGroup,
                    GroupName = GetGroupNameById(response.LinkGroup),
                    LogsData = new List<string> { BuildLogsData(response, issueTypeId, subIssueTypeId) }
                })
                .FirstOrDefault());
    }

    public static void AddDefaultGroupForDisplay(List<GroupLinkedLogUI> groupLinkedLogUI, int issueTypeId, int subIssueTypeId)
    {
        if (!groupLinkedLogUI.Any())
        {
            groupLinkedLogUI.Add(new GroupLinkedLogUI { IsAffectedGroup = false, GroupName = Get1X2GroupNameForIssueType(issueTypeId, subIssueTypeId) });
            groupLinkedLogUI.Add(new GroupLinkedLogUI { IsAffectedGroup = false, GroupName = LinkedLogApiConstant.GroupNameAio });
            return;
        }

        var has1X2Or1H1X2 = groupLinkedLogUI.Exists(x => x.GroupName is LinkedLogApiConstant.GroupName1X2 or LinkedLogApiConstant.GroupName1H1X2);
        var hasAio = groupLinkedLogUI.Exists(x => x.GroupName == LinkedLogApiConstant.GroupNameAio);

        if (has1X2Or1H1X2 && groupLinkedLogUI.Count == 1)
        {
            groupLinkedLogUI.Add(new GroupLinkedLogUI { IsAffectedGroup = false, GroupName = LinkedLogApiConstant.GroupNameAio });
            return;
        }

        if (hasAio && groupLinkedLogUI.Count == 1)
        {
            groupLinkedLogUI.Add(new GroupLinkedLogUI { IsAffectedGroup = false, GroupName = Get1X2GroupNameForIssueType(issueTypeId, subIssueTypeId) });
        }
    }

    private static string Get1X2GroupNameForIssueType(int issueTypeId, int subIssueTypeId)
    {
        return issueTypeId switch
        {
            IssueTypeConstant.WrongHDP => LinkedLogApiConstant.GroupName1X2,
            IssueTypeConstant.WrongOU => LinkedLogApiConstant.GroupName1X2,
            IssueTypeConstant.Wrong1stHDP => LinkedLogApiConstant.GroupName1H1X2,
            IssueTypeConstant.Wrong1stOU => LinkedLogApiConstant.GroupName1H1X2,
            IssueTypeConstant.WrongOdds => subIssueTypeId is SubIssueTypeConstant.Handicap or SubIssueTypeConstant.OverUnder
                ? LinkedLogApiConstant.GroupName1X2 : LinkedLogApiConstant.GroupName1H1X2,
            _ => string.Empty
        };
    }

    private static string GetGroupNameById(int groupId)
    {
        return groupId switch
        {
            LinkedLogApiConstant.GroupId1X2 => LinkedLogApiConstant.GroupName1X2,
            LinkedLogApiConstant.GroupIdAio => LinkedLogApiConstant.GroupNameAio,
            LinkedLogApiConstant.GroupId1H1X2 => LinkedLogApiConstant.GroupName1H1X2,
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