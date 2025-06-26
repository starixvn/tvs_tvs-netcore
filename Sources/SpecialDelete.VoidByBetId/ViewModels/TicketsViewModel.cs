using TicketVoidingSystem.Models;

namespace SpecialDelete.VoidByBetId.ViewModels;

public class TicketsViewModel
{
    public List<Group<TicketViewModel>> Groups { get; set; } = [];
    public string InvalidTransIds { get; set; }
    public string MovedTransIds { get; set; }
    public IEnumerable<BetId> Tickets { get; set; }
    public int TotalItems { get; set; }
    public int SingleCount { get; set; }
    public int ParlayCount { get; set; }
    public DateTime? FromTransTime { get; set; }
    public DateTime? ToTransTime { get; set; }
    public string LicenseesName { get; set; }
    public int MatchId { get; set; }
}