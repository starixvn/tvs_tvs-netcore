namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketCalculateWinLostAccount
{
    public long TransId { get; set; }

    public int CustId { get; set; }

    public decimal WinLost { get; set; }

    public int WinLostMultiply100 { get; set; }

    public int StatusId { get; set; }

    public bool IsVoid14 { get; set; }

    //// more columns for add request
    public int BetType { get; set; }

    public int BetId { get; set; }

    public bool IsMixParlay { get; set; }

    public int SiteDbGroupId { get; set; }

    public int MatchId { get; set; }
}

public class TicketAddRequestJson
{
    public int mid { get; set; }
    public long t { get; set; }
    public int c { get; set; }
    public int btype { get; set; }
    public int bid { get; set; }
    public bool isP { get; set; }
    public int sitedb { get; set; }
    public bool isV14 { get; set; }
}

public class OrderedTickets
{
    public IEnumerable<TicketCalculateWinLostAccount> Ascending { get; set; }
    public decimal TotalWinLost { get; set; }
}