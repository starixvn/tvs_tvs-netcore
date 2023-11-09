using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.ManageRequest.Models;

public class AccountWinlostModel
{
    public int CustId { get; set; }

    public string Username { get; set; }

    public long GivenCredit { get; set; }

    public long AdjustVoidLimit { get; set; }

    public long CurrentWinning { get; set; }

    public long CurrentLosing { get; set; }

    public long EstimateVoidAmount { get; set; }

    public long WinLostAfterVoid { get; set; }

    public bool IsHighlight { get; set; }
}

public class AccountWinlostExcelModel
{
    [Cell("A2")]
    public int No { get; set; }

    [Cell("B2")]
    public string Username { get; set; }

    [Cell("C2")]
    public long GivenCredit { get; set; }

    [Cell("D2")]
    public long AdjustVoidLimit { get; set; }

    [Cell("E2")]
    public long CurrentWinning { get; set; }

    [Cell("F2")]
    public long CurrentLosing { get; set; }

    [Cell("G2")]
    public long EstimateVoidAmount { get; set; }

    [Cell("H2")]
    public long WinLostAfterVoid { get; set; }

    public bool IsHighlight { get; set; }
}