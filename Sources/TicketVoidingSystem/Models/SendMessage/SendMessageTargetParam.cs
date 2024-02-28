using System.Collections.Generic;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Models.SendMessage;

public class SendMessageTargetParam
{
    public IEnumerable<TicketEmailModel> EmailTickets { get; set; }
    public int MatchId { get; set; }
    public Match? Match { get; set; }
    public Message Message { get; set; }
    public bool IsMessageContentAbnormal { get; set; }
    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public bool IsSendMessageToAdminSite { get; set; }
}