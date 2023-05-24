namespace TicketVoidingSystem.ManageRequest.Models;

public class GeneralInfoModel
{
    public DateTime VoidedTime { get; set; }

    public string VoidedTimeString { get; set; }

    public int LeagueId { get; set; }

    public DateTime KickOffTime { get; set; }

    public string KickOffTimeString { get; set; }

    public string LeagueName { get; set; }

    public string MatchEvent { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int Total { get; set; }

    public string DecidedBy { get; set; }

    public string RequestedBy { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public string VoidingHistoryIds { get; set; }
}

public class GroupUserVoidMessage
{
    public GroupUserVoidMessage()
    {
        Messages = new List<UserVoidMessage>();
        VoidedBy = string.Empty;
    }

    public string VoidedBy { get; set; }

    public IEnumerable<UserVoidMessage> Messages { get; set; }
}

public class UserVoidMessage
{
    public string VoidedBy { get; set; }

    public string ContentEnglish { get; set; }

    public string ContentChineseSimplified { get; set; }
}

public class EmailResultModel
{
    public string Message { get; set; }

    public int Type { get; set; }
}