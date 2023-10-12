using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface BetListCoreService
{
    TicketViewModel GetTicket(GetTicketModel item);

    TicketViewModel GetOutrightTicket(GetTicketModel item);
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

    public TicketViewModel GetTicket(GetTicketModel item)
    {
        var ticketDetail = new TicketViewModel();
        var ticket = SetTicket(item);
        var ticketHelper = new TicketHelper
        {
            ShowLeague = false,
            ShowMatch = false,
            ShowSystemParlayDetail = false,
            IsShowOddsWithChoice = item.IsMixParlay
        };
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        if (item.IsMixParlay)
        {
            SetValueSubTicket(ticket, item);
        }

        var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var subTransId = item.SubTransId.ToString(CultureInfo.InvariantCulture);
        var parlayChoice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{subTransId}'>{subChoice}</div><div id=");
        parlayChoice += $"<div id='divEvent_{subTransId}'></div>";
        ticketDetail.Odds = betListService.GetOdds(ticket, false);
        ticketDetail.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketDetail.Choice = item.IsMixParlay ? parlayChoice : mainChoice;
        ticketDetail.Status = betListService.GetStatus(ticket, ticketHelper, null, false);

        return ticketDetail;
    }

    public TicketViewModel GetOutrightTicket(GetTicketModel item)
    {
        var ticketDetail = new TicketViewModel();
        var ticket = SetTicket(item);
        var ticketHelper = new TicketHelper
        {
            ShowBetType = true,
            ShowMatch = true,
            ShowLeague = false,
            ShowSystemParlayDetail = false
        };

        var outrightChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        ticketDetail.Odds = betListService.GetOdds(ticket, false);
        ticketDetail.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketDetail.Choice = outrightChoice;
        ticketDetail.Status = betListService.GetStatus(ticket, ticketHelper, null, false);

        return ticketDetail;
    }

    private Ticket SetTicket(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.ActualStake = item.ActualStake;
        ticket.Stake = item.Stake;
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.IsLive = item.IsLiveIndicator;
        ticket.OddsType = item.IsMixParlay ? string.Empty : item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.SportTypeId = item.SportType;
        ticket.TransId = item.SubTransId;
        ticket.Winlost = FanexCommonConverter.ToDecimal(item.WinLost);
        ticket.BetId = item.IsMixParlay ? default(long?) : item.BetId;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default(byte) : item.SettlementStatus;

        return ticket;
    }

    private static void SetValueSubTicket(ITicket ticket, GetTicketModel item)
    {
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
        ticket.ExtraInfo = item.ExtraInfo;
        ticket.ActualStake = item.ActualStake;
    }
}