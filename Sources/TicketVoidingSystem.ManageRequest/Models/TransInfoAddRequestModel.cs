namespace TicketVoidingSystem.ManageRequest.Models;

public class TransInfoAddRequestModel
{
    public string UnMarkTransIds { get; set; }

    public string MarkTransIds { get; set; }

    public string RemoveTransIds { get; set; }

    public string TransInfoJson { get; set; }
}