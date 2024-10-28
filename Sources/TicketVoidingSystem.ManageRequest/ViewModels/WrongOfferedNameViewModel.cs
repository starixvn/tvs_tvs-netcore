using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class WrongOfferedNameViewModel
{
    public int MatchId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public string CurrencyIds { get; set; }
    public string LicenseeNames { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public Match? Match { get; set; }
    public string WrongName { get; set; }
    public string ActualName { get; set; }
    public string WrongNameT { get; set; }
    public string ActualNameT { get; set; }
    public string WrongNameS { get; set; }
    public string ActualNameS { get; set; }
}