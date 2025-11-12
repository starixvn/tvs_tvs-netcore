using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using TicketVoidingSystem.TicketListing.ViewModels;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.TicketListing.Services;

public interface MapTicketService
{
    IEnumerable<TicketViewModel> MapToListTicketsViewModel(IEnumerable<DetailTicketModel> ticketsModel);

    IEnumerable<ExcelTicketModel> MapToListExcelTicketsModel(IEnumerable<TicketViewModel> ticketsViewModel);
}

public class MapTicketServiceImp(
    BetListService betListService,
    IMapper mapper,
    ConvertBetListForExcelService convertBetListForExcelService)
    : MapTicketService
{
    public IEnumerable<TicketViewModel> MapToListTicketsViewModel(IEnumerable<DetailTicketModel> ticketsModel)
    {
        var tickets = new List<TicketViewModel>();
        foreach (var item in ticketsModel)
        {
            var ticket = MapToTicketViewModel(item);
            tickets.Add(ticket);
        }

        return tickets;
    }

    private TicketViewModel MapToTicketViewModel(DetailTicketModel item)
    {
        var ticket = MapFromBetListToTicketViewModel(item);
        ticket.SecondAcceptFlag = item.SecAcceptFlag ? "<i class=\"fa-solid fa-check\"></i>" : string.Empty;
        ticket.WinLoss = CreateWinLossHtml(item.Status, item.WinLost);
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.BetId = item.TransId.ToString();
        ticket.Currency = item.CurrencyName;
        ticket.Member = item.UserName;
        ticket.BallSequence = item.BallSequence;
        ticket.IsMarked = item.IsMarked;
        ticket.IsSite777 = item.IsSite777;
        ticket.SubTransId = item.SubTransId.ToString();
        ticket.IsHybrid = item.IsHybrid;

        return ticket;
    }

    public IEnumerable<ExcelTicketModel> MapToListExcelTicketsModel(IEnumerable<TicketViewModel> ticketsViewModel)
    {
        var excelTickets = new List<ExcelTicketModel>();
        foreach (var item in ticketsViewModel)
        {
            var ticket = new ExcelTicketModel
            {
                BetId = convertBetListForExcelService.BetIdToText(item),
                TransDate = item.TransDate,
                Member = item.Member,
                Choice = convertBetListForExcelService.ChoiceHtmlToText(item.Choice, item.BetId),
                Odds = item.Odds.DefaultText(),
                BallSequence = item.BallSequence,
                Stake = item.Stake.StakeText(),
                WinLoss = convertBetListForExcelService.WinLossHtmlToText(item.WinLoss),
                Currency = item.Currency,
                BetType = item.BetType.DefaultText(),
                Status = item.Status.DefaultText(),
                Sa = string.IsNullOrWhiteSpace(item.SecondAcceptFlag) ? string.Empty : "√",
                IsSite777 = item.IsSite777
            };
            excelTickets.Add(ticket);
        }

        return excelTickets;
    }

    private static string CreateWinLossHtml(string status, string winLost)
    {
        if (status.IsRunningOrWaiting())
        {
            return string.Empty;
        }

        var value = Convert.ToDecimal(winLost);
        return value < 0 ?
            $"<span style='color: Red;'>{value:#,##0.##}</span>"
            : $"<span style='color: Black;'>{value:#,##0.##}</span>";
    }

    private TicketViewModel MapFromBetListToTicketViewModel(DetailTicketModel item)
    {
        var ticketHtml = new TicketViewModel();
        var ticket = SetMainTicket(item);
        var ticketHelper = new TicketHelper
        {
            ShowLeague = false,
            ShowMatch = false,
            ShowBetType = item.BetType.IsSingleMatchParlay() || item.BetType.IsPenaltyShootoutCombo(),
            IsShowOddsWithChoice = item.IsParlay,
            ShowSystemParlayPlayerComm = item.IsParlay
        };
        ticketHtml.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        ticketHtml.Stake = betListService.BuildStake(ticket, ticketHelper);
        ticketHtml.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        ticketHtml.BetType = betListService.GetBetTypeName(ticket);
        ticketHtml.Choice = GetChoice(ticket, item, ticketHelper);
        ticketHtml.SubTransId = item.SubTransId.ToString();
        ticketHtml.IsHybrid = item.IsHybrid;

        return ticketHtml;
    }

    private string GetChoice(Ticket ticket, DetailTicketModel item, TicketHelper ticketHelper)
    {
        if (!item.IsParlay)
        {
            return betListService.BuildChoice(ticket, ticketHelper, null, false);
        }

        var comboParlayNames = betListService.GetComboParlayName(ticket);
        ticket = SetSubTicket(item);
        var subChoiceBetList = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var subChoice = $"<div {(item.IsHybrid ? "" : "hidden")} class='sub-odds'><span class='label'>Sub Odds</span> @ {item.FinalOdds}</div>" + subChoiceBetList;

        return comboParlayNames + subChoice;
    }

    private Ticket SetMainTicket(DetailTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.TransId = item.TransId;
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.IsLive = item.IsLiveIndicator;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Winlost = FanexCommonConverter.ToDecimal(item.WinLost);
        ticket.SportTypeId = item.SportType;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.Currency = item.CurrencyName;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsParlay ? default : item.SettlementStatus;

        return ticket;
    }

    private Ticket SetSubTicket(DetailTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetId = item.TransId;
        ticket.BetTypeId = item.SubBetType;
        ticket.TransId = item.SubTransId;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.BetTeam = item.SubBetTeam;
        ticket.LiveHomeScore = item.SubLiveHomeScore;
        ticket.LiveAwayScore = item.SubLiveAwayScore;
        ticket.IsLive = item.SubLiveIndicator;
        ticket.Winlost = FanexCommonConverter.ToDecimal(item.WinLost);
        ticket.Odds = item.SubOdds;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.HomeId = item.SubHomeId;
        ticket.AwayId = item.SubAwayId;
        ticket.BetCheck = item.SubBetCheck;
        ticket.TransDesc = item.SubTransDesc;
        ticket.SportTypeId = item.SubSportType;

        return ticket;
    }
}