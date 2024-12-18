namespace TicketVoidingSystem.TicketListing.ViewModels;

public class GetSummaryViewModel
{
    public IEnumerable<SummaryViewModel> GroupByLicensees { get; set; } = new List<SummaryViewModel>();

    public IEnumerable<SummaryViewModel> GroupByBetTypes { get; set; } = new List<SummaryViewModel>();
}