namespace TicketVoidingSystem.ManageRequest.Models;

public class BetTypeTicketsInfo : BetTypeCountJsonModel
{
    public int Id { get; set; }
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

public class AllBetTypesSelection
{
    public string Name { get; set; }
    public string Value { get; set; }
}