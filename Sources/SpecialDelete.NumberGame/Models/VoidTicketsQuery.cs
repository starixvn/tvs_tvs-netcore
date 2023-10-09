using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.NumberGame.Models;

public class VoidTicketsQuery
{
    public int? MatchId { get; set; }

    public DateTime FromTransDate { get; set; }

    public DateTime ToTransDate { get; set; }

    public string BetTypes { get; set; }

    public string BallSequence { get; set; }

    public bool Option { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }

    public string UserName { get; set; }

    public string UserPwd { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public Message Message { get; set; }

    public bool IsSendMessage { get; set; }
}