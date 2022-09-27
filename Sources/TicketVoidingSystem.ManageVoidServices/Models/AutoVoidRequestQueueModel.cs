namespace TicketVoidingSystem.ManageVoidServices.Models
{
    public class AutoVoidRequestQueueModel
    {
        public int SiteDbGroupId { get; set; }
        public int QueueId { get; set; }
        public int RequestId { get; set; }
        public int MatchId { get; set; }
        public string Action { get; set; }
        public int StatusId { get; set; }
        public string BroadcastSessionId { get; set; }
        public int SportType { get; set; }
        public string ErrMsg { get; set; }
    }
}