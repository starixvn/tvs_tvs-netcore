using System;

namespace TicketVoidingSystem.ManageVoidServices.Models;

public class AutoVoidRequestQueueModel
{
    public int SiteDbGroupId { get; set; }
    public int QueueId { get; set; }
    public string RequestIds { get; set; }
    public int MatchId { get; set; }
    public string Action { get; set; }
    public int StatusId { get; set; }
    public string ErrMsg { get; set; }
    public DateTime? CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string BroadcastSessionId { get; set; }
}