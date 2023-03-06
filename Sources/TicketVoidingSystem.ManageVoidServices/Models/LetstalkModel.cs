using System;

namespace TicketVoidingSystem.ManageVoidServices.Models;

public class LetstalkModel
{
    public int RequestId { get; set; }
    public string BroadcastSessionId { get; set; }
    public int StatusId { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}