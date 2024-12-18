using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;

public interface VoidBetListService
{
    TicketViewModel Create(GetTicketModel item);
}

public class VoidBetListServiceImp(
    BetListService betListService,
    BetListVirtualSportsService betListCoreService)
    : VoidBetListService
{
    public TicketViewModel Create(GetTicketModel item)
    {
        var ticket = betListCoreService.SetValue(item);
        var ticketHelper = betListCoreService.CreateTicketHelper();
        var ticketViewModel = betListCoreService.Create(ticket, ticketHelper);

        var choiceMain = betListService.BuildChoice(ticket, ticketHelper, null, false);
        ticket = betListCoreService.SetSubValue(ticket, item);
        var choiceSub = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var choice = choiceMain.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{choiceSub}</div><div id=");
        ticketViewModel.Choice = choice + $"<div id='divEvent_{item.SubTransId}'></div>";

        return ticketViewModel;
    }
}