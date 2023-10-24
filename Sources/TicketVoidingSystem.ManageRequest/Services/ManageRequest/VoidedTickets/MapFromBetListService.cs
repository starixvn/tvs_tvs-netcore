using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;

public interface MapFromBetListService
{
    VoidedTicketViewModel MapToVoidedTicketViewModel(VoidedTicketModel item, Match? match, ChoiceType choiceType, int issueTypeId);
}

public class MapFromBetListServiceImp : MapFromBetListService
{
    private readonly IMapper mapper;
    private readonly BetListService betListService;

    public MapFromBetListServiceImp(IMapper mapper, BetListService betListService)
    {
        this.mapper = mapper;
        this.betListService = betListService;
    }

    public VoidedTicketViewModel MapToVoidedTicketViewModel(VoidedTicketModel item, Match? match, ChoiceType choiceType, int issueTypeId)
    {
        const int minBetType = 801;
        const int maxBetType = 806;

        if (item.BetType is >= minBetType and <= maxBetType)
        {
            item.TransId = item.RefNo;
        }
        var viewModel = new VoidedTicketViewModel();
        var ticketHelper = CreateBetListTicketHelper(item);
        var ticket = MapToBetListTicket(item, match);

        viewModel.Odds = betListService.GetOdds(ticket, Convert.ToInt32(item.BetType).IsParlay());
        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticket);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Choice = IsGetPlainTextForExportExcel(item.BetType, choiceType, item.IsMixParlay, issueTypeId) ?
            betListService.BuildChoiceExcel(ticket, ticketHelper, null, false) :
            BuildChoice(ticket, ticketHelper, item, issueTypeId);

        var choiceBlock = betListService.BuildChoiceBlock(ticket, ticketHelper, null, false);
        viewModel.BettypeCombination = item.BetdaqId != 1 ? CombineBetType(item.IsLiveIndicator, viewModel.BetType, choiceBlock.betTeam) : string.Empty;

        viewModel.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        viewModel.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        viewModel.VoidTime = item.VoidedTime.ToString(FormatKey.LongDateFormatTimeWithSlash);
        viewModel.Member = string.IsNullOrEmpty(item.FollowedUsername) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUsername})";
        viewModel.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
        viewModel.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        viewModel.Currency = item.CurrencyName;
        viewModel.Creator = item.Creator;
        viewModel.IsCashOut = item.IsCashOut;

        return viewModel;
    }

    private static TicketHelper CreateBetListTicketHelper(VoidedTicketModel item)
    {
        var betBuilderTicketHelper = new TicketHelper();
        var generalTicketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
            IsShowOddsWithChoice = item.IsMixParlay,
            ShowLeague = false,
            ShowBetType = Convert.ToInt32(item.BetType).IsPenaltyShootoutCombo(),
            ShowMatch = false
        };
        return Convert.ToInt32(item.BetType).IsSingleMatchParlay() ? betBuilderTicketHelper : generalTicketHelper;
    }

    private Ticket MapToBetListTicket(VoidedTicketModel item, Match? match)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.TransId = item.IsMixParlay ? item.SubTransId : item.TransId;
        ticket.BetTypeId = item.BetType;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default : item.SettlementStatus;
        ticket.IsLive = item.IsLiveIndicator;

        if (match != null)
        {
            ticket.HomeId = match.HomeId;
            ticket.AwayId = match.AwayId;
            ticket.SportTypeId = match.SportType;
            ticket.LeagueId = match.LeagueId;
            ticket.MatchCode = match.MatchCode;
        }
        else
        {
            ticket.SportTypeId = item.SportType != 0 ? item.SportType : 1;
        }

        return ticket;
    }

    private static bool IsGetPlainTextForExportExcel(int betTypeId, ChoiceType choiceType, bool isParlay, int issueTypeId)
    {
        return choiceType == ChoiceType.Excel && (betTypeId.IsSingleMatchParlay() || (isParlay && issueTypeId.IsAbnormalAccountOrAbnormalBet()));
    }

    private string BuildChoice(ITicket ticket, TicketHelper ticketHelper, VoidedTicketModel item, int issueTypeId)
    {
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        return item.IsMixParlay ? GetChoiceForTicketParlay(ticket, ticketHelper, item, issueTypeId, mainChoice) : mainChoice;
    }

    private string GetChoiceForTicketParlay(ITicket ticket, TicketHelper ticketHelper, VoidedTicketModel item, int issueTypeId, string mainChoice)
    {
        if (!issueTypeId.IsAbnormalAccountOrAbnormalBet())
        {
            SetValueSubTicket(ticket, item);
            var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
            mainChoice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
        }

        return mainChoice + $"<div id='divEvent_{item.SubTransId}'></div>";
    }

    private static void SetValueSubTicket(ITicket ticket, VoidedTicketModel item)
    {
        ticket.BetId = default;
        ticket.OddsType = string.Empty;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
        ticket.TransDesc = item.SubTransdesc;
    }

    private static string CombineBetType(bool isLive, string betType, string betTeam)
    {
        var trimBetTeam = betTeam.Replace("&nbsp;", " ").Trim();
        var liveIndicator = isLive ? "Live" : "Non-Live";

        return $"{liveIndicator} {betType} ({trimBetTeam.StripHtml()})";
    }
}