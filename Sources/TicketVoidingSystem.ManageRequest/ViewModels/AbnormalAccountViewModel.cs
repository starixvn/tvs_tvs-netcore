using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class AbnormalAccountViewModel
{
    public string Usernames { get; set; }

    public string ProductIds { get; set; }

    public string StatusIds { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public int SubIssueTypeId { get; set; }

    public bool? IsVoidAllArchivedTickets { get; set; }

    public IEnumerable<AccountWinlostModel>? AccountWinlostModels { get; set; }
}