namespace TicketVoidingSystem.ManageRequest.Models;

public class CheckRecoverTicketModel
{
    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int? FilterBy { get; set; }

    public string ProductIds { get; set; }

    public int MatchId { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }
}