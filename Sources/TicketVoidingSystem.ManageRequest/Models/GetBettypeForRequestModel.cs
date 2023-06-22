namespace TicketVoidingSystem.ManageRequest.Models;

public class GetBettypeForRequestModel
{
    public long Betid { get; set; }

    public int Bettype { get; set; }

    public int RequestId { get; set; }
}