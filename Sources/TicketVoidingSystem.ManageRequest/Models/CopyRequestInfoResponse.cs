namespace TicketVoidingSystem.ManageRequest.Models;

public class CopyRequestInfoResponse
{
    public RequestInfoForCopy RequestInfo { get; set; }

    public IEnumerable<BetTypeTicketsInfo> BetTypeTickets { get; set; }
}

public class RequestInfoForCopy
{
    public string RequestId { get; set; }

    public int MatchId { get; set; }

    public bool IsNeutral { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int LeagueId { get; set; }

    public string MatchEvent { get; set; }

    public string LeagueName { get; set; }

    public DateTime GlobalShowTime { get; set; }

    public int FilterBy { get; set; }

    public string IssueTypeName { get; set; }

    public string SubIssueTypeName { get; set; }

    public string RequestExtraInfo { get; set; }

    public bool IsCheckedVar { get; set; }

    public string OperatorInfo { get; set; }

    public IEnumerable<OperatorInfo> Operators { get; set; }

    public string Provider { get; set; }

    public string RequestedBy { get; set; }

    public bool IsHasSettledTicket { get; set; }

    public string Remark { get; set; }

    public int IssueTypeId { get; set; }

    public DateTime VoidFromTime { get; set; }

    public DateTime VoidToTime { get; set; }

    public string LiveStatus { get; set; }

    public int TotalSingleCount { get; set; }

    public int TotalParlayCount { get; set; }

    public int TotalCancelCashOutCount { get; set; }

    public string FilterOddsType { get; set; }
    public string OddsValue { get; set; }
    public string FromOdds { get; set; }
    public string ToOdds { get; set; }
    public string CorrectOdds { get; set; }
    public int TvDetectionValue { get; set; }
    public int MinuteOffset { get; set; }
    public int SecondOffset { get; set; }
}