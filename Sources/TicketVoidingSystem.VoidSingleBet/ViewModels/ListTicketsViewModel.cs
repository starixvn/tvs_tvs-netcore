using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.VoidSingleBet.ViewModels;

public class ListTicketsViewModel
{
    public int TotalItems { get; set; }

    public int SingleCount { get; set; }

    public int ParlayCount { get; set; }

    public DateTime FromTransTime { get; set; }

    public DateTime ToTransTime { get; set; }

    public DateTime? FromCheckTime { get; set; }

    public DateTime? ToCheckTime { get; set; }

    public ContentByLanguageModel BetTypeNameReplaceMessage { get; set; }

    public string Id { get; set; }

    public IEnumerable<Group<TicketViewModel>> Groups { get; set; }

    public List<AffectedLicensee> LicenseeAffectedList { get; set; }
}