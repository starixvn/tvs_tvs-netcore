namespace TicketVoidingSystem.MarkTickets.ViewModels
{
    using System.Collections.Generic;
    using Core.DTO;

    public class TicketsViewModel
    {
        public TicketsViewModel()
        {
            Groups = new List<Group<TicketViewModel>>();
        }

        public IEnumerable<BetId> TotalItemsList { get; set; }
        public int TotalItems { get; set; }
        public int SingleCount { get; set; }
        public int ParlayCount { get; set; }
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public string InvalidTransIds { get; set; }
        public string MovedTransIds { get; set; }
        public string MarkedTransIds { get; set; }
        public string LicenseesName { get; set; }
        public IList<Group<TicketViewModel>> Groups { get; }
    }
}