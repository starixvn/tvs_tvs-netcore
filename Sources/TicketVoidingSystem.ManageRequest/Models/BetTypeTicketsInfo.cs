namespace TicketVoidingSystem.ManageRequest.Models;

public class BetTypeTicketsInfo : BetTypeCountJsonModel
{
    public string BetTypeName { get; set; }
    public string OriginalBetTypeName { get; set; }
    public string InputtedRuns { get; set; }
    public string PlayerAndOdds { get; set; }
}

public class BetTypeCountJsonModel
{
    public int TicketsCount { get; set; }
    public int BetTypeId { get; set; }
    public long? BetId { get; set; }
    public string? PlayerName { get; set; }
}

public class ControlsAllBetTypesQuery
{
    public string Type { get; set; }
    public string Values { get; set; }
}