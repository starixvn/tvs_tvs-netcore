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

    public string MistakenBy { get; set; }

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
    public DateTime? FilterFromTransTime { get; set; }
    public string ServiceAcceptTime { get; set; }
    public int MinAllowanceTime { get; set; }
    public string MinAcceptType { get; set; }
    public string LiveScores { get; set; }

    //Wrong HDP/Wrong 1st HDP/Wrong OU / Wrong 1st OU

    public string? WrongMarket { get; set; }
    public string? ActualMarket { get; set; }
    public string? FilterFavoriteType { get; set; }
    public string? FavoriteValue { get; set; }
    public string? HdpValue { get; set; }
    public string? HomeName { get; set; }
    public string? AwayName { get; set; }
    public int SportType { get; set; }

    //Wrong Odds

    public string? FromOddsNotVoidHomeOver { get; set; }
    public string? FromOddsNotVoidAwayUnder { get; set; }
    public string? ToOddsNotVoidHomeOver { get; set; }
    public string? ToOddsNotVoidAwayUnder { get; set; }
    public string? CorrectOddsHomeOver { get; set; }
    public string? CorrectOddsAwayUnder { get; set; }
    public int? SubIssueTypeId { get; set; }
}