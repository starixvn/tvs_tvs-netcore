namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketCalculateWinLostAccount
{
    public long TransId { get; set; }

    public int CustId { get; set; }

    public decimal WinLost { get; set; }

    public int WinLostMultiply100 { get; set; }

    public int StatusId { get; set; }

    public bool IsVoid14 { get; set; }
}

public class OrderedTickets
{
    public IEnumerable<TicketCalculateWinLostAccount> Ascending { get; set; }
    public decimal TotalWinLost { get; set; }
}