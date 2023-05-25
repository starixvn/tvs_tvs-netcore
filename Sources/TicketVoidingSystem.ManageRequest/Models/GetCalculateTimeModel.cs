namespace TicketVoidingSystem.ManageRequest.Models;

public class GetCalculateTimeModel
{
    public int RequestId { get; set; }

    public DateTime? CalcHalfTime { get; set; }
    
    public DateTime? CalcFullTime { get; set; }
}
