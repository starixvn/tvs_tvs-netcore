using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.VoidByBetId.Models;

public class VoidTicketsQuery
{
    public string Guid { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }

    public IEnumerable<BetId> TransIdCrickets { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public Message Message { get; set; }

    public string? SubIssueTypeName { get; set; }

    public string? SubIssueTypeNameCS { get; set; }

    public byte? AbnormalBetType { get; set; }

    public Match? Match { get; set; }
}