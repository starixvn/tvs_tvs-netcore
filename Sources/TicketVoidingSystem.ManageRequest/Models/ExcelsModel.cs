using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.ManageRequest.Models;

public class ExcelTicketModel
{
    [Cell("A9")]
    public int No { get; set; }

    [Cell("B9")]
    public string BetId { get; set; }

    [Cell("C9")]
    public string TransDate { get; set; }

    [Cell("D9")]
    public string Member { get; set; }

    [Cell("E9")]
    public string BetType { get; set; }

    [Cell("F9")]
    public string Odds { get; set; }

    [Cell("G9")]
    public string Stake { get; set; }

    [Cell("H9")]
    public string WinLoss { get; set; }

    [Cell("I9")]
    public string Currency { get; set; }

    [Cell("J9")]
    public string Status { get; set; }

    [Cell("K9")]
    public string Score { get; set; }

    [Cell("L9")]
    public string Handicap { get; set; }

    [Cell("M9")]
    public string Choice { get; set; }
}

public class ExcelTicketNoMatchModel
{
    [Cell("A6")]
    public int No { get; set; }

    [Cell("B6")]
    public string BetId { get; set; }

    [Cell("C6")]
    public string TransDate { get; set; }

    [Cell("D6")]
    public string Member { get; set; }

    [Cell("E6")]
    public string BetType { get; set; }

    [Cell("F6")]
    public string Odds { get; set; }

    [Cell("G6")]
    public string Stake { get; set; }

    [Cell("H6")]
    public string WinLoss { get; set; }

    [Cell("I6")]
    public string Currency { get; set; }

    [Cell("J6")]
    public string Status { get; set; }

    [Cell("K6")]
    public string Score { get; set; }

    [Cell("L6")]
    public string Handicap { get; set; }

    [Cell("M6")]
    public string Choice { get; set; }
}

public class ExcelVoidedTicketModel
{
    [Cell("A9")]
    public int No { get; set; }

    [Cell("B9")]
    public string BetId { get; set; }

    [Cell("C9")]
    public string TransDate { get; set; }

    [Cell("D9")]
    public string Member { get; set; }

    [Cell("E9")]
    public string BetType { get; set; }

    [Cell("F9")]
    public string Odds { get; set; }

    [Cell("G9")]
    public string Stake { get; set; }

    [Cell("H9")]
    public string WinLoss { get; set; }

    [Cell("I9")]
    public string Currency { get; set; }

    [Cell("J9")]
    public string Status { get; set; }

    [Cell("K9")]
    public string Creator { get; set; }

    [Cell("L9")]
    public string Score { get; set; }

    [Cell("M9")]
    public string Handicap { get; set; }

    [Cell("N9")]
    public string VoidTime { get; set; }

    [Cell("O9")]
    public string Choice { get; set; }
}

public class ExcelRequestModel
{
    [Cell("A2")]
    public int RequestId { get; set; }

    [Cell("B2")]
    public string Sport { get; set; }

    [Cell("C2")]
    public string IssueType { get; set; }

    [Cell("D2")]
    public string SubIssueType { get; set; }

    [Cell("E2")]
    public string MatchId { get; set; }

    [Cell("F2")]
    public string CalculatedScore { get; set; }

    [Cell("G2")]
    public string Description { get; set; }

    [Cell("H2")]
    public string Event { get; set; }

    [Cell("I2")]
    public string League { get; set; }

    [Cell("J2")]
    public string VarCheck { get; set; }

    [Cell("K2")]
    public string BetType { get; set; }

    [Cell("L2")]
    public string NoOfTickets { get; set; }

    [Cell("M2")]
    public string Action { get; set; }

    [Cell("N2")]
    public string CreatedBy { get; set; }

    [Cell("O2")]
    public string CreatedTime { get; set; }

    [Cell("P2")]
    public string CalcHalfTime { get; set; }

    [Cell("Q2")]
    public string CalcFullTime { get; set; }

    [Cell("R2")]
    public string MistakenBy { get; set; }

    [Cell("S2")]
    public string DecidedBy { get; set; }

    [Cell("T2")]
    public string PerformedBy { get; set; }

    [Cell("U2")]
    public string CheckedBy { get; set; }

    public int? NumberOfRequestDetails { get; set; }

    public int? Index { get; set; }
}