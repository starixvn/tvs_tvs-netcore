using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class GetPoolHouseTicketViewModel
{
    public IEnumerable<GroupBetTypeModel> GroupBetTypes { get; set; }

    public TicketsViewModel AffectedTickets { get; set; }

    public TicketsViewModel OtherTickets { get; set; }

    public bool IsAffectedGroupAIO { get; set; }

    public bool IsAffectedGroup1X2 { get; set; }

    public bool IsAffectedGroup1H1X2 { get; set; }
}