using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.ViewModels;
using System.Globalization;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.NumberGame.Services.GetTickets;

public interface BetListCoreService
{
    TicketViewModel GetTicket(GetTicketModel item, bool isRecover);
}

public class BetListCoreServiceImp(IMapper mapper, BetListService betListService) : BetListCoreService
{
    public TicketViewModel GetTicket(GetTicketModel item, bool isRecover)
    {
        var viewModel = new TicketViewModel();
        var ticket = SetValue(item);
        var ticketHelper = new TicketHelper
        {
            ShowLeague = true,
            ShowMatch = true,
            ShowBetType = isRecover,
            IsShowOddsWithChoice = false
        };

        viewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        var choice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        viewModel.Choice = item.BetType == BetTypeConstant.NumberWheel ? choice.Split(',').Aggregate((cur, next) => cur + ',' + ' ' + next) : choice;

        if (!isRecover)
        {
            viewModel.BetType = betListService.GetBetType(item.BetType, LanguageCode.English);
            viewModel.BetTypeSimplified = betListService.GetBetType(item.BetType, LanguageCode.ChineseSimplified);
        }

        return viewModel;
    }

    private Ticket SetValue(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.IsLive = item.IsLiveIndicator;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;

        return ticket;
    }
}