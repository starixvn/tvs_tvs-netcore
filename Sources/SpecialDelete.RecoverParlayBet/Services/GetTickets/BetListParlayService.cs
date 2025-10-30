using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using System.Globalization;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.RecoverParlayBet.Services.GetTickets;

public interface BetListParlayService<in T>
{
    TicketViewModel Map(T item, bool isOnlyReadPermission);
}

public class BetListSubParlayServiceImp<T>(BetListService betListService) : BetListParlayService<T>
    where T : GetSubTicket
{
    public TicketViewModel Map(T item, bool isOnlyReadPermission)
    {
        var ticketViewModel = new TicketViewModel();
        var ticket = SetValue(item);
        var ticketHelper = new TicketHelper
        {
            ShowLeague = true,
            ShowMatch = true,
            ShowBetType = true,
            IsShowOddsWithChoice = true,
            ShowSystemParlayDetail = false
        };
        ticketViewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        ticketViewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketViewModel.BetType = betListService.GetBetTypeName(ticket);
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        SetValueSubTicket(ticket, item);
        var subChoiceBetList = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var subChoice = $"<div {(item.IsHybrid ? "" : "hidden")} class='sub-odds'><span class='label'>Sub Odds</span> @ {item.FinalOdds}</div>" + subChoiceBetList;
        var choice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
        ticketViewModel.Choice = choice + $"<div id='divEvent_{item.SubTransId}'></div>";
        ticketViewModel.IsDisable = isOnlyReadPermission || item.Status.IsVoided();
        return ticketViewModel;
    }

    private static Ticket SetValue(T item)
    {
        return new Ticket
        {
            AwayId = item.SubAwayId,
            BetCheck = item.BetCheck,
            BetId = item.BetId,
            BetTeam = item.BetTeam,
            BetTypeId = item.BetType,
            Handicap1 = item.Hdp1,
            Handicap2 = item.Hdp2,
            HomeId = item.SubHomeId,
            IsLive = item.SubLiveIndicator,
            LeagueId = item.SubLeagueId,
            LiveAwayScore = item.SubLiveAwayScore,
            LiveHomeScore = item.SubLiveHomeScore,
            Odds = item.Odds,
            RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture),
            SportTypeId = item.SubSportType,
            Stake = item.Stake,
            Status = item.Status,
            TransDesc = item.SubTransDesc,
            TransId = item.SubTransId,
            TransDate = item.TransDate,
            ActualStake = item.ActualStake,
            ExtraInfo = item.ExtraInfo,
            OddsSpread = item.OddsSpread
        };
    }

    private static void SetValueSubTicket(ITicket ticket, T item)
    {
        ticket.BetId = default;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
    }
}

public class BetListMainParlayServiceImp<T>(BetListService betListService) : BetListParlayService<T>
    where T : GetMainTicket
{
    public TicketViewModel Map(T item, bool isOnlyReadPermission)
    {
        var ticketViewModel = new TicketViewModel();
        var ticket = SetValue(item);
        var ticketHelper = new TicketHelper { ShowSystemParlayDetail = false };
        ticketViewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        ticketViewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketViewModel.BetType = betListService.GetBetTypeName(ticket);
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        ticketViewModel.Choice = mainChoice + $"<div id='divEvent_{item.RefNo}'></div>";
        ticketViewModel.IsDisable = isOnlyReadPermission;
        return ticketViewModel;
    }

    private static Ticket SetValue(T item)
    {
        var ticket = new Ticket
        {
            BetId = item.BetId,
            BetTypeId = item.BetType,
            BetTeam = item.BetTeam,
            LiveHomeScore = item.LiveHomeScore,
            LiveAwayScore = item.LiveAwayScore,
            IsLive = item.LiveIndicator,
            Stake = item.Stake,
            Odds = item.Odds,
            Handicap1 = item.Hdp1,
            Handicap2 = item.Hdp2,
            Status = item.Status,
            BetCheck = item.BetCheck,
            TransDesc = item.TransDesc,
            TransId = item.RefNo,
            RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture),
            ActualStake = item.ActualStake,
            ExtraInfo = item.ExtraInfo
        };

        return ticket;
    }
}