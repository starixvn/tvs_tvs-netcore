namespace TicketVoidingSystem.ManageRequest.Models;

public class OddsInfoModel
{
    public int MatchId { get; set; }

    public int SubIssueTypeId { get; set; }

    public int MaxBet { get; set; }

    public decimal Spread { get; set; }
}

public class OddsInfoRequest
{
    public int MatchId { get; set; }

    public int SubType { get; set; }
}