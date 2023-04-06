using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface BetListCoreService
{
    TicketViewModel GetTicket(GetTicketModel item, Match match, ChoiceType choiceType, int issueTypeId);
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

    public TicketViewModel GetTicket(GetTicketModel item, Match match, ChoiceType choiceType, int issueTypeId)
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

        viewModel.Odds = betListService.GetOdds(ticket, false);
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticket);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Choice = IsGetPlainTextForExportExcel(ticket.BetTypeId, choiceType, item.IsMixParlay, issueTypeId) ?
            betListService.BuildChoiceExcel(ticket, ticketHelper, null, false) :
            BuildChoice(ticket, ticketHelper, item, issueTypeId);
        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);

        return viewModel;
    }

    private static bool IsGetPlainTextForExportExcel(int betTypeId, ChoiceType choiceType, bool isParlay, int issueTypeId)
    {
        if (choiceType == ChoiceType.Excel && (betTypeId.IsSingleMatchParlay() || (isParlay && issueTypeId.IsAbnormalAccountOrAbnormalBet())))
        {
            return true;
        }

        return false;
    }

    private Ticket SetTicket(GetTicketModel item, Match match)
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
            ticket.SportTypeId = item.SportType;
        }
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default(byte) : item.SettlementStatus;
        ticket.IsLive = item.IsLiveIndicator;

        return ticket;
    }

    private string BuildChoice(ITicket ticket, TicketHelper ticketHelper, GetTicketModel item, int issueTypeId)
    {
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        if (item.IsMixParlay)
        {
            if (!issueTypeId.IsAbnormalAccountOrAbnormalBet())
            {
                SetValueSubTicket(ticket, item);
                var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
                mainChoice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
            }

            return mainChoice + $"<div id='divEvent_{item.SubTransId}'></div>";
        }

        return mainChoice;
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