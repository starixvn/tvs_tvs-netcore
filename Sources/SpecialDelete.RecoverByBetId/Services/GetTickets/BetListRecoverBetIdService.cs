using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.RecoverByBetId.Services.GetTickets;

public interface BetListRecoverBetIdService
{
    TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType);
}

public class BetListRecoverBetIdServiceImp(IMapper mapper, BetListService betListService) : BetListRecoverBetIdService
{
    public TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType)
    {
        var ticketViewModel = new TicketViewModel();
        var ticketHelper = new TicketHelper();
        var ticket = SetTicket(item);

        ticketViewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketViewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        ticketViewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        ticketViewModel.Choice = choiceType == ChoiceType.Email ?
            betListService.BuildChoiceExcel(ticket, ticketHelper, null, false).Replace("\n", "<br/>") :
            betListService.BuildChoice(ticket, ticketHelper, null, false);

        return ticketViewModel;
    }

    private Ticket SetTicket(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.IsLive = item.IsLiveIndicator;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.Currency = item.CurrencyName;
        ticket.EventDate = item.BetType.IsBitCoin() ? item.EndTime : new DateTimeOffset().DateTime;

        return ticket;
    }
}