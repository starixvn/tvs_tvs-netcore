namespace TicketVoidingSystem.ManageRequest.Models;

public class GeneralInfoModel
{
    public int? MatchId { get; set; }

    public DateTime VoidedTime { get; set; }

    public string VoidedTimeString { get; set; }

    public int LeagueId { get; set; }

    public DateTime KickOffTime { get; set; }

    public string KickOffTimeString { get; set; }

    public string LeagueName { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int SportType { get; set; }

    public int Total { get; set; }

    public string DecidedBy { get; set; }

    public string RequestedBy { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public string VoidingHistoryIds { get; set; }

    public string SingleTransIds { get; set; }

    public DateTime RecoveredTime { get; set; }

    public string RecoveredTimeString { get; set; }
}

public class GroupUserVoidMessage
{
    public string VoidedBy { get; set; } = string.Empty;

    public IEnumerable<UserVoidMessage> Messages { get; set; } = new List<UserVoidMessage>();
}

public class UserVoidMessage
{
    public int MatchId { get; set; }

    public string VoidedBy { get; set; }

    public string ContentEnglish { get; set; }

    public string ContentChineseSimplified { get; set; }
}

public class EmailResultModel
{
    public string Message { get; set; }

    public int Type { get; set; }
}