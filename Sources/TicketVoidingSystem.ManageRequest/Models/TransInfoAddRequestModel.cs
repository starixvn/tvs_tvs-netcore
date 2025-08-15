namespace TicketVoidingSystem.ManageRequest.Models;

public class TransInfoAddRequestModel
{
    public string? UnMarkTransIds { get; set; }

    public string? MarkTransIds { get; set; }

    public string? RemoveTransIds { get; set; }

    public string? TransInfoJson { get; set; }

    // Info SiteDBDown
    public int SingleCount { get; set; }
    public int ParlayCount { get; set; }
    public int CancelCashOutCount { get; set; }
    public string? UserNames { get; set; }
    public string? SiteDBDownInfoJson { get; set; }
}