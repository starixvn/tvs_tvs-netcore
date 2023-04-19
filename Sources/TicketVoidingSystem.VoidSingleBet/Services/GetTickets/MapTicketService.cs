using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface MapTicketService
{
    TicketViewModel MapToTicketViewModel(GetTicketModel item, Match match, UserPermission permission);

    ExcelTicketModel MapToTicketExcelModel(GetTicketModel item, Match match);
}

public class MapTicketServiceImp : MapTicketService
{
    private readonly IMapper mapper;
    private readonly CheckBoxService checkBoxService;
    private readonly BetListService betListService;

    public MapTicketServiceImp(BetListService betListService, IMapper mapper, CheckBoxService checkBoxService)
    {
        this.betListService = betListService;
        this.mapper = mapper;
        this.checkBoxService = checkBoxService;
    }

    public TicketViewModel MapToTicketViewModel(GetTicketModel item, Match match, UserPermission permission)
    {
        var viewModel = MapToTicketViewModel(item, match);
        viewModel.IsDisable = checkBoxService.IsDisable(item, permission);
        viewModel.Value = item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString();
        viewModel.MainTransId = item.MainTransId.ToString();
        viewModel.IsCricket = item.IsCricket;
        viewModel.IsMarked = item.IsMarked;

        return viewModel;
    }

    private TicketViewModel MapToTicketViewModel(GetTicketModel item, Match match)
    {
        var viewModel = new TicketViewModel();
        var ticketHelper = new TicketHelper
        {
            IsShowOddsWithChoice = item.IsMixParlay,
            ShowSystemParlayDetail = false,
        };
        var ticketBetList = CreateTicketBetList(item, match);
        viewModel.Odds = betListService.GetOdds(ticketBetList, false);
        viewModel.Stake = betListService.BuildStake(ticketBetList, ticketHelper);
        viewModel.BetType = betListService.GetBetTypeName(ticketBetList);
        viewModel.Choice = BuildChoice(ticketBetList, ticketHelper, item);
        viewModel.Status = betListService.GetStatus(ticketBetList, ticketHelper, null, false);
        viewModel.Handicap = betListService.GetHandicap(ticketBetList, ticketHelper, null, false);

        viewModel.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        viewModel.SecondAcceptFlag = item.SecAcceptFlag ? "<span class='icon-tick'></span>" : string.Empty;
        viewModel.TransDate = item.TransDate.ToString(FormatKey.DateTimeWithMillisecondAndSlash);
        viewModel.Member = string.IsNullOrEmpty(item.FollowedUsername) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUsername})";
        viewModel.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
        viewModel.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        viewModel.Currency = item.CurrencyName;

        viewModel.SiteDbGroupId = item.SiteDbGroupId;
        return viewModel;
    }

    public ExcelTicketModel MapToTicketExcelModel(GetTicketModel item, Match match)
    {
        var viewModel = MapToTicketViewModel(item, match);
        viewModel.SecondAcceptFlag = item.SecAcceptFlag ? "x" : string.Empty;

        var excelTicket = mapper.Map<ExcelTicketModel>(viewModel);
        excelTicket.BetId = viewModel.BetId.LineBreak();
        excelTicket.Member = viewModel.Member.LineBreak();
        excelTicket.Odds = viewModel.Odds.DefaultText();
        excelTicket.Stake = viewModel.Stake.StakeText();
        excelTicket.Status = viewModel.Status.DefaultText();
        excelTicket.Sa = item.SecAcceptFlag ? "√" : string.Empty;
        excelTicket.Choice = viewModel.Choice.ChoiceSubParlay(item.IsMixParlay);

        return excelTicket;
    }

    private Ticket CreateTicketBetList(GetTicketModel item, Match match)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.TransId = item.SubTransId;
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
        ticket.HomeId = match.HomeId;
        ticket.AwayId = match.AwayId;
        ticket.LeagueId = match.LeagueId;
        ticket.SportTypeId = match.SportType;
        ticket.MatchCode = match.MatchCode;
        ticket.IsNeutral = match.IsNeutral;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default : item.SettlementStatus;
        ticket.IsLive = item.IsLiveIndicator;

        return ticket;
    }

    private string BuildChoice(ITicket ticket, ITicketHelper ticketHelper, GetTicketModel item)
    {
        var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        if (!item.IsMixParlay)
        {
            return mainChoice;
        }
        SetValueSubTicket(ticket, item);
        var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        var choice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
        return choice + $"<div id='divEvent_{item.SubTransId}'></div>";
    }

    private static void SetValueSubTicket(ITicket ticket, GetTicketModel item)
    {
        ticket.BetId = default;
        ticket.OddsType = string.Empty;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTypeId = item.SubBetType;
        ticket.BetTeam = item.SubBetTeam;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;
    }
}