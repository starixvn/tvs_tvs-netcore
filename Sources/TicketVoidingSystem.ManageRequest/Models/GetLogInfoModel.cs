namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLogInfoModel
{
    public int MatchId { get; set; }
    public int ScoreId { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public Validation? Validation { get; set; }
    public IEnumerable<TicketRequest>? TicketRequest { get; set; }
    public IEnumerable<BetTypeTicketsInfo>? BetTypeCount { get; set; }
}

public class GetLogInfoViewModel
{
    public IEnumerable<GetLogInfoModel>? GetLogInfoModels { get; set; }
    public TransInfoAddRequestModel? TransInfoAddRequestModel { get; set; }
}

public class LogInfoDetail
{
    public int MatchId { get; set; }
    public int ScoreId { get; set; }
    public string? LiveScores { get; set; }
    public DateTime VoidFromTime { get; set; }
    public DateTime VoidToTime { get; set; }
    public DateTime AcceptVoidToTime { get; set; }
    public int SingleCount { get; set; }
    public int CashOutCount { get; set; }
    public int CancelCashOutCount { get; set; }
    public int SettleCount { get; set; }
    public int InstantlySettleCount { get; set; }
    public int MainParlayCount { get; set; }
    public DateTime? HighlightMinTime { get; set; }
    public int? HighlightAcceptType { get; set; }
    public string? ScoreNormalTicket { get; set; }
    public string? ScoreOfMatch { get; set; }
    public string MinTransId { get; set; }
    public string ActionType { get; set; }

    // Wrong HDP/1stHDP

    public int LiveGameEarlySingleCount { get; set; }
    public int LiveGameEarlyCashOutCount { get; set; }
    public int LiveGameEarlySettleCount { get; set; }
    public int LiveGameEarlyInstantlySettleCount { get; set; }
    public int PoolHouseSingleCount { get; set; }
    public int PoolHouseCashOutCount { get; set; }
    public int PoolHouseSettleCount { get; set; }
    public int PoolHouseMainParlayCount { get; set; }
    public int PoolHouseInstantlySettleCount { get; set; }

    // Wrong HDP/1stHDP, Wrong OU/1H OU, Wrong Odds
    public string? LiveGameEarlyTicketsJson { get; set; }
}

public class Validation
{
    public int ScoreId { get; set; }
    public int MatchId { get; set; }
    public bool IsInvalidTotalTickets { get; set; }
    public bool IsExistedInOtherRequest { get; set; }
    public bool IsPoolHouseAffected { get; set; }
    public bool IsExistsSecondAccept { get; set; }
}