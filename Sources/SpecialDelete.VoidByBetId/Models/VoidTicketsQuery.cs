using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.VoidByBetId.Models;

public class VoidTicketsQuery
{
    public string Guid { get; set; }

    public IEnumerable<BetId> Tickets { get; set; }

    public IEnumerable<BetId> TransIdCrickets { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public Message Message { get; set; }

    public string SubIssueTypeName { get; set; }

    public string SubIssueTypeNameCS { get; set; }

    public string FilterUserName { get; set; }

    public string Products { get; set; }

    public string StatusIds { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string VoidFromTime { get; set; }

    public string VoidToTime { get; set; }

    public string VoidFromDate { get; set; }

    public string VoidToDate { get; set; }

    public Match Match { get; set; }

    public bool IsFilterByBetId { get; set; }

    public bool IsLikeLyAbnormalBet => IssueTypeId == IssueTypeConstant.AbnormalBet || IssueTypeId == IssueTypeConstant.AbnormalBetRealMember;
}