using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using Newtonsoft.Json;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface BetListCoreService
{
    TicketEmailViewModel BuildTicket(TicketEmailModel item, Match match, SiteEmail site, bool isFromAfterVoidService);
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

    public TicketEmailViewModel BuildTicket(TicketEmailModel item, Match match, SiteEmail site, bool isFromAfterVoidService)
    {
        var viewModel = new TicketEmailViewModel();
        var ticket = CreateTicket(item, match);
        var ticketHelper = new TicketHelper
        {
            IsShowOddsWithChoice = item.IsMixParlay,
            ShowSystemParlayDetail = false,
            ShowMatch = !isFromAfterVoidService,
            ShowLeague = !isFromAfterVoidService
        };
        viewModel.Odds = betListService.GetOdds(ticket, false);
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticket);
        viewModel.BetTypeSimplified = betListService.GetBetTypeNameChineseSimplified(ticket);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Choice = BuildChoice(ticket, ticketHelper, item, match, site);
        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);

        return viewModel;
    }

    private Ticket CreateTicket(TicketEmailModel item, Match match)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.Currency = item.CurrencyName;
        ticket.Winlost = FanexCommonConverter.ToDecimal(item.Winlost);
        ticket.OddsType = item.IsMixParlay ? string.Empty : item.OddsType.ToString();
        ticket.BetId = item.IsMixParlay ? default : item.BetId;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default : item.SettlementStatus;
        if (item.BetTypeId.IsBitCoin())
        {
            ticket.EventDate = item.EndTime;
        }
        UpdateTicketWithMatch(ticket, match);

        return ticket;
    }

    private static void UpdateTicketWithMatch(ITicket ticket, Match match)
    {
        if (match != null)
        {
            ticket.HomeId = match.HomeId;
            ticket.AwayId = match.AwayId;
            ticket.SportTypeId = match.SportType;
            ticket.LeagueId = match.LeagueId;
            ticket.IsNeutral = match.IsNeutral;
            ticket.MatchCode = match.MatchCode;
        }
    }

    private string BuildChoice(ITicket ticket, ITicketHelper ticketHelper, TicketEmailModel item, Match match, SiteEmail site)
    {
        if (item.IsMixParlay)
        {
            return BuildChoiceParlay(ticket, ticketHelper, item);
        }

        var choice = betListService.BuildChoiceExcel(ticket, ticketHelper, null, false).Replace("\n", "<br/>");

        if (Helper.IsMustRemoveSabaText(match, site))
        {
            var serializedChoice = JsonConvert.SerializeObject(choice);
            choice = JsonConvert.DeserializeObject<string>(serializedChoice.Replace("沙巴", "").Replace("SABA ", ""));
        }

        return choice;
    }

    private string BuildChoiceParlay(ITicket ticket, ITicketHelper ticketHelper, TicketEmailModel item)
    {
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);

        if (item.BetTypeId.IsParlay())
        {
            return mainChoice;
        }

        SetValueSubTicket(ticket, item);
        var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        return mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
    }

    private static void SetValueSubTicket(ITicket ticket, TicketEmailModel item)
    {
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTeam = item.SubBetTeam;
        ticket.BetTypeId = item.SubBetType;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
        ticket.TransDesc = item.SubTransDesc;
    }
}