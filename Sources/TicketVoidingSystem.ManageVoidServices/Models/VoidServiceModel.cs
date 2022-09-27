using System;

namespace TicketVoidingSystem.ManageVoidServices.Models
{
    public class VoidServiceModel
    {
        public int Id { get; set; }
        public string BroadcastSessionId { get; set; }
        public int SiteDbGroupId { get; set; }
        public int RequestId { get; set; }
        public int VoidingHistoryId { get; set; }
        public int StatusId { get; set; }
        public bool IsAutoVoid { get; set; }
        public int MatchId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}