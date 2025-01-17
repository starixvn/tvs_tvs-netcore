using Epplus.Mapper.Annotations;

namespace TicketVoidingSystem.ManageRequest.Models;

public class AccountWinlostModel
{
    public int CustId { get; set; }

    public string Username { get; set; }

    public decimal GivenCredit { get; set; }

    public decimal? AdjustVoidLimit { get; set; }

    public decimal CurrentWinning { get; set; }

    public decimal CurrentLosing { get; set; }

    public decimal EstimateVoidAmount { get; set; }

    public decimal EstimateVoidAmountUnEditableTickets { get; set; }

    public decimal WinLostAfterVoid { get; set; }

    public bool IsHighlight { get; set; }

    public bool IsEditedTicket { get; set; }

    public bool IsCanEditTicket { get; set; }

    public bool IsShowOnTable { get; set; }

    public IEnumerable<TicketCalculateWinLostAccount> VoidTickets { get; set; }
}

public class AccountWinlostExcelModel
{
    [Cell("A2")]
    public int No { get; set; }

    [Cell("B2")]
    public string Username { get; set; }

    [Cell("C2")]
    public decimal GivenCredit { get; set; }

    [Cell("D2")]
    public decimal? AdjustVoidLimit { get; set; }

    [Cell("E2")]
    public decimal CurrentWinning { get; set; }

    [Cell("F2")]
    public decimal CurrentLosing { get; set; }

    [Cell("G2")]
    public decimal EstimateVoidAmount { get; set; }

    [Cell("H2")]
    public decimal WinLostAfterVoid { get; set; }

    public bool IsHighlight { get; set; }
}