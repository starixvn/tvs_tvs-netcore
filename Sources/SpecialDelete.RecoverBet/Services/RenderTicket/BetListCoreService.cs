using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.RecoverBet.Services.RenderTicket;

public interface IBetListCoreService
{
    TicketViewModel GetTicket(GetTicketModel item);
}

public class BetListCoreService(IMapper mapper, BetListService betListService) : IBetListCoreService
{
    public TicketViewModel GetTicket(GetTicketModel item)
    {
        var viewModel = new TicketViewModel();
        var ticketHelper = new TicketHelper
        {
            IsShowOddsWithChoice = item.BetType.IsParlay()
        };
        var ticket = SetValue(item);
        viewModel.Choice = betListService.BuildChoice(ticket, ticketHelper, null, false);

        if (ticket.OddsType != OddsTypeConstant.Myanmar.ToString() && item.BetType != BetTypeConstant.SabaOUTimeMachine)
        {
            viewModel.Choice = viewModel.Choice.Replace("class='handicap'", "class='handicap' style='display: none;'");
        }

        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);
        viewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Score = betListService.GetScoreBetListUi(item.SportType, item.IsLiveIndicator, item.LiveHomeScore, item.LiveAwayScore);
        return viewModel;
    }

    private Ticket SetValue(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.SportTypeId = item.SportType;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.IsLive = item.IsLiveIndicator;

        return ticket;
    }
}