using System;

namespace TicketVoidingSystem.ManageVoidServices.Models;

public class VoidingHistoryModel
{
    public int VoidingHistoryId { get; set; }
    public int StatusId { get; set; }
    public int RequestId { get; set; }
    public int MessageId { get; set; }
    public int? MessageIdSpecial { get; set; }
    public int ReasonId { get; set; }
    public int UserId { get; set; }
    public DateTime? CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string TransIds { get; set; }
    public string VoidData { get; set; }
    public string BroadcastSessionId { get; set; }
    public int SiteDbGroupId { get; set; }
    public DateTime? MinWinLostDate { get; set; }
    public DateTime? MaxWinLostDate { get; set; }
}