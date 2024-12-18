using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;

public interface RecoverBetListService
{
    TicketViewModel Create(GetTicketModel item, Recover typeOfRecover);
}

public class RecoverBetListServiceImp(
    BetListService betListService,
    BetListVirtualSportsService betListVirtualSportsService)
    : RecoverBetListService
{
    public TicketViewModel Create(GetTicketModel item, Recover typeOfRecover)
    {
        var ticket = betListVirtualSportsService.SetValue(item);
        var ticketHelper = betListVirtualSportsService.CreateTicketHelper();
        var ticketViewModel = betListVirtualSportsService.Create(ticket, ticketHelper);

        switch (typeOfRecover)
        {
            case Recover.Single:
                ticketHelper.IsShowOddsWithChoice = false;
                ticketViewModel.Choice = betListService.BuildChoice(ticket, ticketHelper, null, false);
                break;

            case Recover.SubParlay:
                {
                    var choiceMain = betListService.BuildChoice(ticket, ticketHelper, null, false);
                    ticket = betListVirtualSportsService.SetSubValue(ticket, item);
                    var choiceSub = betListService.BuildChoice(ticket, ticketHelper, null, false);
                    var choice = choiceMain.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{choiceSub}</div><div id=");
                    ticketViewModel.Choice = choice + $"<div id='divEvent_{item.SubTransId}'></div>";
                    break;
                }
            default:
                {
                    var choiceMain = betListService.BuildChoice(ticket, ticketHelper, null, false);
                    var choice = choiceMain.Replace("divEvent_0", $"divEvent_{item.RefNo}")
                        .Replace("combinationOfferName_0", $"combinationOfferName_{item.RefNo}");
                    ticketViewModel.Choice = choice + $"<div id='divEvent_{item.RefNo}'></div>";
                    break;
                }
        }

        return ticketViewModel;
    }
}