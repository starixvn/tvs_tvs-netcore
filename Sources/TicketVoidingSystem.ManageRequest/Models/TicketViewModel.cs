using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketsViewModel
{
    public TicketsViewModel()
    {
        Groups = new List<Group<TicketViewModel>>();
    }

    public IEnumerable<Group<TicketViewModel>> Groups { get; set; }
    public int Total { get; set; }
    public int TotalSingle { get; set; }
    public int TotalParlay { get; set; }
    public int TotalCancelCashOut { get; set; }
    public List<AffectedLicensee> LicenseeAffectedList { get; set; }
    public bool IsAllLiveTickets { get; set; }
    public bool IsAllNonLiveTickets { get; set; }
    public string BetTypes { get; set; }
    public string BetTeam { get; set; }
    public string InputOverUnder { get; set; }
    public DateTime FromTime { get; set; }
    public DateTime ToTime { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public List<BetId> SingleTickets { get; set; }
    public List<BetId> ParlayTickets { get; set; }
    public List<BetId> CancelCashOutTickets { get; set; }
    public List<BetId> CricketTickets { get; set; }
    public List<string> UncheckedTransIds { get; set; }
    public bool IsHasSettledTicket { get; set; }
    public List<BetId> CheckPermissionTickets { get; set; }
    public List<BetId> AllCancelCashOutTickets { get; set; }
    public short GroupPHAffected { get; set; }
    public ContentByLanguageModel BetTypeNameReplaceMessage { get; set; }
}

public class TicketViewModel
{
    public int No { get; set; }
    public string BetId { get; set; }
    public string Value { get; set; }
    public string TransDate { get; set; }
    public string Member { get; set; }
    public string BetType { get; set; }
    public short BetTypeId { get; set; }
    public short SubBetTypeId { get; set; }
    public string Odds { get; set; }
    public string Stake { get; set; }
    public string WinLoss { get; set; }
    public string Currency { get; set; }
    public string Status { get; set; }
    public string Score { get; set; }
    public string Handicap { get; set; }
    public string Choice { get; set; }
    public string MainTransId { get; set; }
    public bool IsParlay { get; set; }
    public bool IsDisable { get; set; }
    public bool IsCricket { get; set; }
    public bool IsCancelCashOut { get; set; }
    public bool IsBonus { get; set; }
    public bool IsMarked { get; set; }
    public int SiteDbGroupId { get; set; }
    public string GroupName { get; set; }
}