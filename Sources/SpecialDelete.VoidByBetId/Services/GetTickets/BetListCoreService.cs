using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.VoidByBetId.Services.GetTickets;

public interface BetListCoreService
{
    TicketViewModel Create(GetTicketModel item, ChoiceType choiceType);
}

public class BetListCoreServiceImp(IMapper mapper, BetListService betListService) : BetListCoreService
{
    public TicketViewModel Create(GetTicketModel item, ChoiceType choiceType)
    {
        var ticketDetail = new TicketViewModel();
        var ticketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
            ShowMatch = true
        };
        var ticket = SetValue(item);
        ticketDetail.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        ticketDetail.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketDetail.BetType = betListService.GetBetTypeName(ticket);
        ticketDetail.Choice = choiceType == ChoiceType.Excel ?
            betListService.BuildChoiceExcel(ticket, ticketHelper, null, false) :
            GetChoiceHtml(ticket, ticketHelper, item);
        ticketDetail.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        ticketDetail.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);
        ticketDetail.Score = betListService.GetScoreBetListUi(item.SportType, item.LiveIndicator, item.LiveHomeScore, item.LiveAwayScore);

        return ticketDetail;
    }

    private string GetChoiceHtml(Ticket ticket, TicketHelper ticketHelper, GetTicketModel item)
    {
        var choiceBlock = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var choiceWithRefNoInEvent = choiceBlock.Replace("divEvent_0", $"divEvent_{item.RefNo}");
        var choiceWithRefNoInOfferName = choiceWithRefNoInEvent.Replace("combinationOfferName_0", $"combinationOfferName_{item.RefNo}");
        return choiceWithRefNoInOfferName + $"<div id='divEvent_{item.RefNo}'></div>";
    }

    private Ticket SetValue(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.IsLive = item.LiveIndicator;
        ticket.SportTypeId = item.SportType;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.Currency = item.CurrencyName;
        ticket.TransId = item.BetType.IsSingleMatchParlay() ? item.TransId : 0;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        if (item.BetType.IsBitCoin())
        {
            ticket.EventDate = item.EndTime;
        }

        return ticket;
    }
}