using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Models;

public class NotParticipateBetTypesViewModel
{
    public IEnumerable<NotParticipateBetTypesModel> NotParticipateBetTypes { get; set; }

    public IEnumerable<OddsInfoViewModel> NotParticipatePlayers { get; set; }
}

public class NotParticipateBetTypesModel
{
    public int BetTypeId { get; set; }

    public string BetTypeName { get; set; }

    public int ParentId { get; set; }

    public int? PlayerId { get; set; }

    public string ParentName { get; set; }
}