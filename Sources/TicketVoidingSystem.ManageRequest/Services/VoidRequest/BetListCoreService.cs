using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface BetListCoreService
{
    TicketViewModel GetTicket(GetTicketModel item, Match? match, ChoiceType choiceType, int issueTypeId);
}

public class BetListCoreServiceImp(IMapper mapper, BetListService betListService) : BetListCoreService
{
    public TicketViewModel GetTicket(GetTicketModel item, Match? match, ChoiceType choiceType, int issueTypeId)
    {
        var viewModel = new TicketViewModel();
        var betBuilderTicketHelper = new TicketHelper();
        var generalTicketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
            IsShowOddsWithChoice = item.IsMixParlay,
            ShowLeague = false,
            ShowBetType = Convert.ToInt32(item.BetType).IsPenaltyShootoutCombo(),
            ShowMatch = false
        };
        var ticketHelper = Convert.ToInt32(item.BetType).IsSingleMatchParlay() ? betBuilderTicketHelper : generalTicketHelper;

        var ticket = SetTicket(item, match);

        viewModel.Odds = betListService.GetOdds(ticket, Convert.ToInt32(item.BetType).IsParlay());
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticket);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Choice = IsGetPlainTextForExportExcel(ticket.BetTypeId, choiceType, item.IsMixParlay, issueTypeId) ?
            betListService.BuildChoiceExcel(ticket, ticketHelper, null, false) :
            BuildChoice(ticket, ticketHelper, item, issueTypeId);
        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);
        viewModel.Score = betListService.GetScoreBetListUi(item.SportType, item.IsLiveIndicator, item.LiveHomeScore, item.LiveAwayScore);

        return viewModel;
    }

    private static bool IsGetPlainTextForExportExcel(int betTypeId, ChoiceType choiceType, bool isParlay, int issueTypeId)
    {
        return choiceType == ChoiceType.Excel && (betTypeId.IsSingleMatchParlay() || (isParlay && issueTypeId.IsIssueTypeVoidMainParlay()));
    }

    private Ticket SetTicket(GetTicketModel item, Match? match)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.TransId = item.SubTransId;
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        if (match != null)
        {
            ticket.HomeId = match.HomeId;
            ticket.AwayId = match.AwayId;
            ticket.SportTypeId = match.SportType;
            ticket.LeagueId = match.LeagueId;
            ticket.IsNeutral = match.IsNeutral;
            ticket.MatchCode = match.MatchCode;
        }
        else
        {
            ticket.AwayId = item.AwayId;
            ticket.HomeId = item.HomeId;
            ticket.LeagueId = item.LeagueId;
            ticket.SportTypeId = item.SportType != 0 ? item.SportType : 1;
        }
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default : item.SettlementStatus;
        ticket.IsLive = item.IsLiveIndicator;

        return ticket;
    }

    private string BuildChoice(ITicket ticket, TicketHelper ticketHelper, GetTicketModel item, int issueTypeId)
    {
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        return item.IsMixParlay ? BuildChoiceParlay(ticket, ticketHelper, item, issueTypeId, mainChoice) : mainChoice;
    }

    private string BuildChoiceParlay(ITicket ticket, TicketHelper ticketHelper, GetTicketModel item, int issueTypeId, string mainChoice)
    {
        if (issueTypeId.IsIssueTypeVoidMainParlay())
        {
            return mainChoice + $"<div id='divEvent_{item.SubTransId}'></div>";
        }

        SetValueSubTicket(ticket, item);
        var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        mainChoice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");

        return mainChoice + $"<div id='divEvent_{item.SubTransId}'></div>";
    }

    private static void SetValueSubTicket(ITicket ticket, GetTicketModel item)
    {
        ticket.BetId = default;
        ticket.OddsType = string.Empty;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
        ticket.TransDesc = item.TransDesc;
    }
}