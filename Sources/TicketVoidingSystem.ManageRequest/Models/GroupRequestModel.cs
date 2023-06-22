namespace TicketVoidingSystem.ManageRequest.Models;

public class GroupRequestModel
{
    public int RequestId { get; set; }
    public IEnumerable<RequestModel> RequestModels { get; set; }
}