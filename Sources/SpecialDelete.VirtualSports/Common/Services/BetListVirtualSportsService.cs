using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.ViewModels;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.Common.Services;

public interface BetListVirtualSportsService
{
    TicketHelper CreateTicketHelper();

    Ticket SetValue(GetTicketModel item);

    Ticket SetSubValue(Ticket ticket, GetTicketModel item);

    TicketViewModel Create(Ticket ticket, TicketHelper ticketHelper);
}

public class BetListVirtualSportsServiceImp(IMapper mapper, BetListService betListService) : BetListVirtualSportsService
{
    public TicketHelper CreateTicketHelper()
    {
        return new TicketHelper
        {
            IsShowOddsWithChoice = true,
            ShowSystemParlayDetail = false
        };
    }

    public Ticket SetValue(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.TransId = item.SubTransId;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.IsLive = item.IsLiveIndicator;
        ticket.ActualStake = item.Stake;
        ticket.Winlost = FanexCommonConverter.ToDecimal(item.WinLost);
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.SportTypeId = item.SportType;

        return ticket;
    }

    public Ticket SetSubValue(Ticket ticket, GetTicketModel item)
    {
        ticket.BetCheck = item.SubBetCheck;
        ticket.Odds = item.SubOdds;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.TransDesc = item.SubTransDesc;
        ticket.BetId = null;
        return ticket;
    }

    public TicketViewModel Create(Ticket ticket, TicketHelper ticketHelper)
    {
        return new TicketViewModel
        {
            Odds = betListService.GetOdds(ticket, true),
            Stake = betListService.BuildStake(ticket, ticketHelper),
            Status = betListService.GetStatus(ticket, ticketHelper, null, false)
        };
    }
}