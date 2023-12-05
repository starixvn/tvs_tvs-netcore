namespace TicketVoidingSystem.ManageRequest.Models;

public class ExportTicketAbnormalBetQuery
{
    public int? RequestId { get; set; }
    public AbnormalBetTicketViewModel[] Tickets { get; set; }
}