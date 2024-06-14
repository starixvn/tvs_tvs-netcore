using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class AbnormalBetViewModel
{
    public string TransIds { get; set; }

    public int? FilterBy { get; set; }

    public int SubIssueTypeId { get; set; }

    public string SubIssueTypeName { get; set; }

    public bool IsConfirmCalculator { get; set; }

    public IEnumerable<MatchInfoAddRequest>? Matches { get; set; }

    public IEnumerable<SendLetstalkModel> SendLetstalkModels { get; set; }
}