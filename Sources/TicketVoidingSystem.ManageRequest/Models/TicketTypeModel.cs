namespace TicketVoidingSystem.ManageRequest.Models;

public class TicketTypeModel
{
    public IEnumerable<RequestDetailTicketModel> ValidVoidSingleTickets { get; set; }
    public IEnumerable<RequestDetailTicketModel> SingleTicketsResettle { get; set; }

    public IEnumerable<RequestDetailTicketModel> ValidVoidParlayTickets { get; set; }
    public IEnumerable<RequestDetailTicketModel> ParlayTicketsResettle { get; set; }

    public IEnumerable<RequestDetailTicketModel> ValidVoidCricketTickets { get; set; }
    public IEnumerable<RequestDetailTicketModel> CricketTicketsResettle { get; set; }

    public IEnumerable<RequestDetailTicketModel> ValidCancelCOTickets { get; set; }

    public IEnumerable<RequestDetailTicketModel> ValidVoidSingleTickets14 { get; set; }
}