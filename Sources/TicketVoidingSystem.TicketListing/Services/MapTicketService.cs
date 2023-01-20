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

namespace TicketVoidingSystem.TicketListing.Services
{
    public interface MapTicketService
    {
        IEnumerable<TicketViewModel> MapToListTicketsViewModel(IEnumerable<DetailTicketModel> ticketsModel);

        IEnumerable<ExcelTicketModel> MapToListExcelTicketsModel(IEnumerable<TicketViewModel> ticketsViewModel);
    }

    public class MapTicketServiceImp : MapTicketService
    {
        private readonly IMapper mapper;
        private readonly BetListService betListService;
        private readonly ConvertBetListForExcelService convertBetListForExcelService;

        public MapTicketServiceImp(BetListService betListService, IMapper mapper, ConvertBetListForExcelService convertBetListForExcelService)
        {
            this.betListService = betListService;
            this.mapper = mapper;
            this.convertBetListForExcelService = convertBetListForExcelService;
        }

        public IEnumerable<TicketViewModel> MapToListTicketsViewModel(IEnumerable<DetailTicketModel> ticketsModel)
        {
            var tickets = new List<TicketViewModel>();
            foreach (var item in ticketsModel)
            {
                var ticket = MapToTicketViewModel(item);
                ticket.BetId = item.TransId.ToString();
                ticket.Currency = item.CurrencyName;
                ticket.Member = item.UserName;
                ticket.BallSequence = item.BallSequence;
                ticket.IsMarked = item.IsMarked;
                tickets.Add(ticket);
            }

            return tickets;
        }

        public IEnumerable<ExcelTicketModel> MapToListExcelTicketsModel(IEnumerable<TicketViewModel> ticketsViewModel)
        {
            var excelTickets = new List<ExcelTicketModel>();
            foreach (var item in ticketsViewModel)
            {
                var ticket = new ExcelTicketModel
                {
                    BetId = item.BetId,
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
                    Sa = string.IsNullOrWhiteSpace(item.SecondAcceptFlag) ? string.Empty : "√"
                };
                excelTickets.Add(ticket);
            }

            return excelTickets;
        }

        private TicketViewModel MapToTicketViewModel(DetailTicketModel item)
        {
            var ticket = MapFromBetListToTicketViewModel(item);
            ticket.SecondAcceptFlag = item.SecAcceptFlag ? "<span class='icon-tick'></span>" : string.Empty;
            ticket.WinLoss = CreateWinLossHtml(item.Status, item.WinLost);
            ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);

            return ticket;
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
            ticketHtml.Odds = betListService.GetOdds(ticket, item.IsParlay);
            ticketHtml.Stake = betListService.BuildStake(ticket, ticketHelper);
            ticketHtml.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
            ticketHtml.BetType = betListService.GetBetTypeName(ticket);
            if (item.IsParlay)
            {
                var comboParlayNames = betListService.GetComboParlayName(ticket);
                ticket = SetSubTicket(item);
                ticketHtml.Choice = comboParlayNames + betListService.BuildChoice(ticket, ticketHelper, null, false);
            }
            else
            {
                ticketHtml.Choice = betListService.BuildChoice(ticket, ticketHelper, null, false);
            }

            return ticketHtml;
        }

        private Ticket SetMainTicket(DetailTicketModel item)
        {
            var ticket = mapper.Map<Ticket>(item);
            ticket.TransId = item.TransId;
            ticket.MasterOdds = item.MOdds;
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
            ticket.SettlementStatus = item.IsParlay ? default(byte) : item.SettlementStatus;

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
            ticket.MasterOdds = item.MOdds;
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
}