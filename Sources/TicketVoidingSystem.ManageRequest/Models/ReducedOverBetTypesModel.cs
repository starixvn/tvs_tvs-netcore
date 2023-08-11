namespace TicketVoidingSystem.ManageRequest.Models;

public class ReducedOverBetTypesViewModel
{
    public IEnumerable<ReducedOverBetTypesModel> ReducedOverBetTypes { get; set; }
}

public class ReducedOverBetTypesModel
{
    public int BetTypeId { get; set; }

    public string BetTypeName { get; set; }

    public bool IsHasOverWicket { get; set; }

    public bool IsHasPlayer { get; set; }

    public bool IsHasRuns { get; set; }

    public int ParentId { get; set; }

    public IEnumerable<ReducedOverBetTypesModel> Items { get; set; }
}