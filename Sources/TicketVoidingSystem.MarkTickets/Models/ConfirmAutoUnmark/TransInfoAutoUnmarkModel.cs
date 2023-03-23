using System;

namespace TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark
{
    public class TransInfoAutoUnmarkModel
    {
        public long TransId { get; set; }
        public int MatchId { get; set; }
        public int Bettype { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int MarkType { get; set; }
        public string BetId { get; set; }
    }
}