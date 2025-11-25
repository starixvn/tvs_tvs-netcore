namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLogInfoModel
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public int ScoreId { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public Validation? Validation { get; set; }
    public IEnumerable<TicketRequest>? TicketRequest { get; set; }
    public IEnumerable<BetTypeTicketsInfo>? BetTypeCount { get; set; }
}

public class GetLogInfoViewModel
{
    public InfoSiteDBDownModel InfoSiteDBDownModel { get; set; }
    public IEnumerable<GetLogInfoModel>? GetLogInfoModels { get; set; }
    public TransInfoAddRequestModel? TransInfoAddRequestModel { get; set; }
}

public class LogInfoDetail
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public int ScoreId { get; set; }
    public string? LiveScores { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public DateTime? TransVoidToTime { get; set; }
    public int CancelCashOutCount { get; set; }
    public int MainParlayCount { get; set; }
    public DateTime? HighlightMinTime { get; set; }
    public int? HighlightAcceptType { get; set; }
    public string? ScoreNormalTicket { get; set; }
    public string? ScoreOfMatch { get; set; }
    public string? MinTransId { get; set; }
    public string? ActionType { get; set; }

    // Wrong HDP/1stHDP
    public int SingleCount { get; set; }

    public int CashOutCount { get; set; }
    public int SettleCount { get; set; }
    public int InstantlySettleCount { get; set; }

    public int PoolHouseSingleCount { get; set; }
    public int PoolHouseCashOutCount { get; set; }
    public int PoolHouseSettleCount { get; set; }
    public int PoolHouseMainParlayCount { get; set; }
    public int PoolHouseInstantlySettleCount { get; set; }

    //Wrong HDP/1stHDP, Wrong OU/1H OU, Wrong Odds Wrong Market Offered & Technical Error
    public string? LogInfoTicketsJson { get; set; }

    // Danger Accepted & Wrong Score
    public int ExcludedTicketsCount { get; set; }

    public string? ExcludedTicketsJson { get; set; }
}

public class Validation
{
    public int Id { get; set; }
    public int ScoreId { get; set; }
    public int MatchId { get; set; }
    public bool IsInvalidTotalTickets { get; set; }
    public bool IsExistedInOtherRequest { get; set; }
    public bool IsExistsSecondAccept { get; set; }
    public bool IsHasSettledTicket { get; set; }
    public bool IsHasInstantlySettledTicket { get; set; }
}

public class LogInfoResult
{
    public IEnumerable<Validation> Validations { get; set; }
    public IEnumerable<TicketRequest> TicketRequests { get; set; }
    public IEnumerable<LogInfoDetail> LogInfoDetails { get; set; }
    public IEnumerable<TransInfoAddRequestModel> TransInfoAddRequests { get; set; }
    public IEnumerable<BetTypeTicketsInfo> BetTypeTickets { get; set; }
}

public class VoidTimeByAllowanceSetting
{
    public int MatchId { get; set; }
    public int ScoreId { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
}