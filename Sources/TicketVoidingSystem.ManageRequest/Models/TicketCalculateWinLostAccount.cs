namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketCalculateWinLostAccount : GetTicketModel
{
    public int WinLostMultiply100 { get; set; }

    public bool IsVoid14 { get; set; }

    public int CustId { get; set; }
}

public class TicketAddRequestJson
{
    public int mid { get; set; }
    public long t { get; set; }
    public int c { get; set; }
    public int btype { get; set; }
    public int? bid { get; set; }
    public bool isP { get; set; }
    public int sitedb { get; set; }
    public bool isV14 { get; set; }
}

public class OrderedTickets
{
    public IEnumerable<TicketCalculateWinLostAccount> Descending { get; set; }
    public decimal TotalWinLost { get; set; }
}

public class AdjustedTickets
{
    public int CustId { get; set; }
    public long TransId { get; set; }
    public bool IsChecked { get; set; }
}