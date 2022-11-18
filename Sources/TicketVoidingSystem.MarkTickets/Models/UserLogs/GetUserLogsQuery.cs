using System;

namespace TicketVoidingSystem.MarkTickets.Models.UserLogs
{
    public class GetUserLogsQuery
    {
        public DateTime? LogDateFrom { get; set; }

        public DateTime? LogDateTo { get; set; }

        public int? MatchId { get; set; }

        public string LogActionIds { get; set; }

        public string DoneBy { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}