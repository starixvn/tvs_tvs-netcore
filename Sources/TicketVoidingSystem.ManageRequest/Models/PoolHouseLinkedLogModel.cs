namespace TicketVoidingSystem.ManageRequest.Models;

public class PoolHouseLinkedLogRequest
{
    public int MatchId { get; set; }

    public int LiveIndicator { get; set; }
}

public class PoolHouseLinkedLogResponse
{
    public int LinkGroup { get; set; }
    public DateTime Time { get; set; }
    public int HomeScore { get; set; }
    public int AwayScore { get; set; }
    public Dictionary<int, LinkedOddsInfo> LinkedOddsInfoDic { get; set; }
}

public class LinkedOddsInfo
{
    public int BetType { get; set; }
    public decimal? Hdp1 { get; set; }
    public decimal? Hdp2 { get; set; }
    public decimal? Odds1a { get; set; }
    public decimal? Odds2a { get; set; }
}

public class PoolHouseLinkedLogData
{
    public string GroupName { get; set; }
    public IEnumerable<string> LogsData { get; set; }
}

public class PoolHouseLinkedLogDataItem
{
    public string GroupName { get; set; }
    public string LogsData { get; set; }
}

public class LinkedLogDataViewModel
{
    public IEnumerable<PoolHouseLinkedLogData> PoolHouseLinkedLogsData { get; set; }
    public Result Result { get; set; }
    public bool IsLinkGroup1X2 { get; set; }
    public bool IsLinkGroupAIO { get; set; }
}