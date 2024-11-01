using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Models.SendEmail;

public class EmailVoidModel
{
    public string NegativeBalanceUsers { get; set; }
    public Match Match { get; set; }
    public string Reason { get; set; }
    public string ReasonSC { get; set; }
    public Message Message { get; set; }
    public Message SpecialMessageAfterVoidService { get; set; }
    public int IssueTypeId { get; set; }
    public bool IsFilterByUsername { get; set; }
    public int RequestId { get; set; }
    public int? FilterBy { get; set; }
    public int SportType { get; set; }
    public int VoidingHistoryId { get; set; }
}