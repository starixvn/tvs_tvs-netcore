namespace TicketVoidingSystem.ManageRequest.Models;

public class OddsInfoModel
{
    public string SubIssueTypeId { get; set; }

    public decimal? MaxBet { get; set; }

    public string? Spread { get; set; }
}