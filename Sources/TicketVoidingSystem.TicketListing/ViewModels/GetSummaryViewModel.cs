namespace TicketVoidingSystem.TicketListing.ViewModels
{
    public class GetSummaryViewModel
    {
        public GetSummaryViewModel()
        {
            GroupByBetTypes = new List<SummaryViewModel>();
            GroupByLicensees = new List<SummaryViewModel>();
        }

        public IEnumerable<SummaryViewModel> GroupByLicensees { get; set; }

        public IEnumerable<SummaryViewModel> GroupByBetTypes { get; set; }
    }
}