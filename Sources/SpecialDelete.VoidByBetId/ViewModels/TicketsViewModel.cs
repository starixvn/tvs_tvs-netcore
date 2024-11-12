using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByBetId.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = new();
    public string InvalidTransIds { get; set; }
    public string MovedTransIds { get; set; }
    public IEnumerable<BetId> Tickets { get; set; }
    public int TotalItem { get; set; }
    public int SingleCount { get; set; }
    public int ParlayCount { get; set; }
    public string FromTime { get; set; }
    public string ToTime { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string LicenseesName { get; set; }
    public int MatchId { get; set; }
}