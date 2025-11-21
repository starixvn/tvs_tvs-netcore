using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class VoidedTicketsViewModel
{
    public IList<Group<VoidedTicketViewModel>> Groups { get; set; } = new List<Group<VoidedTicketViewModel>>();
    public int TotalTicketsProcessed { get; set; }
    public int TotalCancelCashOutProcessed { get; set; }
    public string LicenseeNames { get; set; }
    public string CancelCashOutLicenseesName { get; set; }
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
    public bool IsHybrid { get; set; }
    public string SubTransId { get; set; }
}