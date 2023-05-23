using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class VoidedTicketsViewModel
{
    public VoidedTicketsViewModel()
    {
        Groups = new List<Group<VoidedTicketViewModel>>();
    }

    public IList<Group<VoidedTicketViewModel>> Groups { get; set; }
    public int TotalVoidedTickets { get; set; }
    public int TotalCancelCashOut { get; set; }
    public string LicenseeNames { get; set; }
    public string GeneralBetTypeCombinations { get; set; }
}

public class VoidedTicketViewModel
{
    public int No { get; set; }
    public string BetId { get; set; }
    public string TransDate { get; set; }
    public string Member { get; set; }
    public string BetType { get; set; }
    public string Odds { get; set; }
    public string Stake { get; set; }
    public string WinLoss { get; set; }
    public string Currency { get; set; }
    public string Status { get; set; }
    public string Creator { get; set; }
    public string Score { get; set; }
    public string Handicap { get; set; }
    public string Choice { get; set; }
    public string VoidTime { get; set; }
    public bool IsCashOut { get; set; }
    public string BettypeCombination { get; set; }
}