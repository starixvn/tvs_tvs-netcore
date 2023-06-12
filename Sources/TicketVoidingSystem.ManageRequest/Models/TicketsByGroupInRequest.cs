namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketsByGroupInRequest
{
    public IEnumerable<GetTicketModel> SingleTickets { get; set; }
    public IEnumerable<GetTicketModel> ParlayTickets { get; set; }
    public IEnumerable<GetTicketModel> CricketTickets { get; set; }
    public IEnumerable<GetTicketModel> CancelCashOutTickets { get; set; }
}