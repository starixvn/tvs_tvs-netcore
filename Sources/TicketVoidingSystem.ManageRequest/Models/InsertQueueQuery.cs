using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.ManageRequest.Models;

public class InsertQueueQuery
{
    public int RequestId { get; set; }
    public int MatchId { get; set; }
    public IEnumerable<BetId>? SingleTickets { get; set; }
    public IEnumerable<BetId>? ParlayTickets { get; set; }
    public IEnumerable<BetId>? CashOutTickets { get; set; }
    public IEnumerable<BetId>? CancelCashOutTickets { get; set; }
    public IEnumerable<BetId>? CricketTickets { get; set; }
    public string? Reason { get; set; }
    public string? ReasonSC { get; set; }
    public Message? Message { get; set; }
    public string? VoidFromTime { get; set; }
    public string? VoidToTime { get; set; }
    public string? VoidFromDate { get; set; }
    public string? VoidToDate { get; set; }
    public string? DecidedBy { get; set; }
    public int SubIssueTypeId { get; set; }
    public string? SubIssueTypeName { get; set; }
    public string? SubIssueTypeNameCS { get; set; }
    public int IssueTypeId { get; set; }
    public bool IsHasSettledTicket { get; set; }
    public string UserName { get; set; }
    public string UserPassword { get; set; }
}

public class RequestInsertQueueJson
{
    public int RequestId { get; set; }
    public int MatchId { get; set; }
}