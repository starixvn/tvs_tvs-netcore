using System;

namespace TicketVoidingSystem.ManageVoidServices.Models;

public class TicketVoidingQueueModel
{
    public int SiteDbGroupId { get; set; }
    public int QueueId { get; set; }
    public int RequestId { get; set; }
    public int MatchId { get; set; }
    public int VoidingHistoryId { get; set; }
    public int StatusId { get; set; }
    public string TransIds { get; set; }
    public int UserId { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? ExecTime { get; set; }
    public int Duration { get; set; }
    public int VoidingTypeId { get; set; }
    public int TotalTicket { get; set; }
    public string ErrMsg { get; set; }
    public string NegativeBalanceUsers { get; set; }
    public string FailedTransIds { get; set; }
    public int IssueTypeId { get; set; }
}