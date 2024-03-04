using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface BetListCoreService
{
    TicketRecoverEmailViewModel GetNormalTicket(TicketRecoverEmailModel item);

    TicketRecoverEmailViewModel GetMainParlayTicket(TicketRecoverEmailModel item);
}

public class BetListCoreServiceImp : BetListCoreService
{
    private readonly IMapper mapper;
    private readonly BetListService betListService;

    public BetListCoreServiceImp(IMapper mapper, BetListService betListService)
    {
        this.mapper = mapper;
        this.betListService = betListService;
    }

    public TicketRecoverEmailViewModel GetNormalTicket(TicketRecoverEmailModel item)
    {
        var viewModel = new TicketRecoverEmailViewModel();
        var ticketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
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

        return viewModel;
    }

    public TicketRecoverEmailViewModel GetMainParlayTicket(TicketRecoverEmailModel item)
    {
        var viewModel = new TicketRecoverEmailViewModel();
        var ticket = SetValue(item);
        var ticketHelper = new TicketHelper { ShowSystemParlayDetail = false };
        viewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticket);
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        viewModel.Choice = mainChoice + $"<div id='divEvent_{item.RefNo}'></div>";
        viewModel.Status = item.Status;
        return viewModel;
    }

    private Ticket SetValue(TicketRecoverEmailModel item)
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