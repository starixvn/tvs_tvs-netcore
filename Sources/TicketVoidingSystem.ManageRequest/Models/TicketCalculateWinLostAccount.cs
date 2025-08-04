using System.Globalization;

namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketCalculateWinLostAccount : GetTicketModel
{
    public int WinLostMultiply100 { get; set; }

    public bool IsVoid14 { get; set; }

    public int CustId { get; set; }

    public new decimal WinLost
    {
        get => decimal.TryParse(base.WinLost, out var result) ? result : 0;
        set => base.WinLost = value.ToString(CultureInfo.InvariantCulture);
    }
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