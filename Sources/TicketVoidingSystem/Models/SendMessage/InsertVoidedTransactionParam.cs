using System.Collections.Generic;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Models.SendMessage;

public class InsertVoidedTransactionParam
{
    public IEnumerable<TicketEmailModel> EmailTickets { get; set; }
    public int MessageId { get; set; }
    public int ReasonId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public bool IsAbnormalBet { get; set; }
}