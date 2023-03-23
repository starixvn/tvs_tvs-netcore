namespace TicketVoidingSystem.MarkTickets.ViewModels
{
    using System.Collections.Generic;

    public class GetUserLogsViewModel
    {
        public IEnumerable<GetUserLogViewModel> LogList { get; set; }

        public int TotalLogs { get; set; }
    }
}