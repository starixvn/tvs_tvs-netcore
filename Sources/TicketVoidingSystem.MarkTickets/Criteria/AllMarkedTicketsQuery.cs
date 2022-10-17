namespace TicketVoidingSystem.MarkTickets.Criteria
{
    public class AllMarkedTicketsQuery
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public int MarkedBy { get; set; }
    }
}