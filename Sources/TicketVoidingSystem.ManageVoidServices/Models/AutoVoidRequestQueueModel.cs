namespace TicketVoidingSystem.ManageVoidServices.Models
{
    public class AutoVoidRequestQueueModel
    {
        public int RequestId { get; set; }
        public int MatchId { get; set; }
        public string Action { get; set; }
        public int StatusId { get; set; }
        public string BroadcastSessionId { get; set; }
        public int QueueId { get; set; }
        public int SiteDbGroupId { get; set; }
        //// For Manage void services page

        public string ErrMsg { get; set; }
    }
}