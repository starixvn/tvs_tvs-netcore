using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;

public interface MapAbnormalBetTicketsExcelService
{
    IEnumerable<AbnormalBetTicketViewModel> MapDataToAbnormalBetTicketViewModel(
        IEnumerable<GetAbnormalBetTicketModel> abnormalBetTickets);
}

public class MapAbnormalBetTicketsExcelServiceImp : MapAbnormalBetTicketsExcelService
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly RemotingRefWrapperService remotingRefWrapperService;

    public MapAbnormalBetTicketsExcelServiceImp(IMapper mapper, RemotingRefWrapperService remotingRefWrapperService,
        BetListService betListService)
    {
        this.mapper = mapper;
        this.remotingRefWrapperService = remotingRefWrapperService;
        this.betListService = betListService;
    }

    public IEnumerable<AbnormalBetTicketViewModel> MapDataToAbnormalBetTicketViewModel(
        IEnumerable<GetAbnormalBetTicketModel> abnormalBetTickets)
    {
        var tickets = new List<AbnormalBetTicketViewModel>();
        var index = 1;
        foreach (var item in abnormalBetTickets)
        {
            var ticket = GetAbnormalBetTicketViewModel(item);
            ticket.No = index++;

            tickets.Add(ticket);
        }

        return tickets;
    }

    private AbnormalBetTicketViewModel GetAbnormalBetTicketViewModel(GetAbnormalBetTicketModel abnormalBetTicket)
    {
        if (abnormalBetTicket.MatchId == null)
        {
            return new AbnormalBetTicketViewModel
            {
                BetId = abnormalBetTicket.TransId.ToString(),
                Remark = RemarkConstant.RemarkList.First(x => x.Id == abnormalBetTicket.RemarkId).Name
            };
        }

        var ticketViewModel = SetAbnormalBetTicketViewModel(abnormalBetTicket);
        var getTicketModel = mapper.Map<GetTicketModel>(abnormalBetTicket);
        var betBuilderTicketHelper = new TicketHelper();
        var generalTicketHelper = new TicketHelper
        {
            ShowSystemParlayDetail = false,
            IsShowOddsWithChoice = getTicketModel.IsMixParlay,
            ShowLeague = false,
            ShowBetType = Convert.ToInt32(getTicketModel.BetType).IsPenaltyShootoutCombo(),
            ShowMatch = false
        };
        var ticket = SetTicket(getTicketModel);
        var ticketHelper = Convert.ToInt32(getTicketModel.BetType).IsSingleMatchParlay()
            ? betBuilderTicketHelper
            : generalTicketHelper;
        ticketViewModel.Odds = betListService.GetOdds(ticket, Convert.ToInt32(getTicketModel.BetType).IsParlay())
            .DefaultText();
        ticketViewModel.BetType = betListService.GetBetTypeName(ticket);
        ticketViewModel.Stake = betListService.BuildStake(ticket, ticketHelper).StakeText();
        ticketViewModel.Hdp = betListService.GetHandicap(ticket, ticketHelper, null, false);

        return ticketViewModel;
    }

    private Ticket SetTicket(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.TransId = item.TransId;
        ticket.BetTypeId = item.BetType;
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.AwayId = item.AwayId;
        ticket.HomeId = item.HomeId;
        ticket.LeagueId = item.LeagueId;
        ticket.SportTypeId = item.SportType != 0 ? item.SportType : 1;
        ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
        ticket.RefCode = 0;
        ticket.SettlementStatus = item.IsMixParlay ? default : item.SettlementStatus;
        ticket.IsLive = item.IsLiveIndicator;

        return ticket;
    }

    private AbnormalBetTicketViewModel SetAbnormalBetTicketViewModel(GetAbnormalBetTicketModel item)
    {
        var ticket = mapper.Map<AbnormalBetTicketViewModel>(item);
        ticket.BetId = item.TransId.ToString();
        ticket.LeagueName = remotingRefWrapperService.GetLeagueName(item.SportType, item.LeagueId, LanguageCode.English);
        ticket.MatchEvent = GetMatchEvent(item.SportType, item.HomeId, item.AwayId);
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.Member = item.UserName;
        ticket.WinLoss = item.Status.IsRunningOrWaiting()
            ? "-"
            : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Score = betListService.GetScoreBetListUi(item.SportType, item.IsLiveIndicator, item.LiveHomeScore, item.LiveAwayScore);
        ticket.Remark = RemarkConstant.RemarkList.First(x => x.Id == item.RemarkId).Name;
        ticket.Vip = item.IsVipMember ? "VIP" : string.Empty;
        ticket.Currency = item.CurrencyName;
        ticket.CustomerClass = item.CustomerClass?.ToString();
        ticket.Choice = item.BetTeam;

        return ticket;
    }

    private string GetMatchEvent(int sportType, int homeId, int awayId)
    {
        var homeName = remotingRefWrapperService.GetTeamName(sportType, homeId, LanguageCode.English);
        var awayName = remotingRefWrapperService.GetTeamName(sportType, awayId, LanguageCode.English);
        return $"{homeName} - vs - {awayName}";
    }
}