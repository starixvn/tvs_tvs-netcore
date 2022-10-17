namespace TicketVoidingSystem.MarkTickets.Services.GetTickets
{
    using System.Globalization;
    using AutoMapper;
    using Common.Extensions;
    using Common.Services;
    using Fanex.BetList.Core.Entities;
    using Fanex.BetList.Core.TicketHelper;
    using Models;
    using ViewModels;

    public interface IBetListCoreService
    {
        TicketViewModel GetTicket(GetTicketModel item);
    }

    public class BetListCoreService : IBetListCoreService
    {
        private readonly BetListService betListService;

        public BetListCoreService(BetListService betListService)
        {
            this.betListService = betListService;
        }

        public TicketViewModel GetTicket(GetTicketModel item)
        {
            var viewModel = new TicketViewModel();
            var ticketHelper = new TicketHelper
            {
                ShowSystemParlayDetail = false,
                IsShowOddsWithChoice = item.IsMixParlay
            };
            var ticket = SetTicket(item);

            viewModel.Odds = betListService.GetOdds(ticket, false);
            viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
            viewModel.BetType = betListService.GetBetTypeName(ticket);
            viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
            viewModel.Choice = BuildChoice(ticket, ticketHelper, item);
            viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);

            return viewModel;
        }

        private static Ticket SetTicket(GetTicketModel item)
        {
            var ticket = Mapper.Map<Ticket>(item);
            ticket.TransId = item.SubTransId;
            ticket.BetTypeId = item.BetType;
            ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
            ticket.Handicap1 = item.Hdp1;
            ticket.Handicap2 = item.Hdp2;
            ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);
            ticket.HomeId = item.HomeId;
            ticket.AwayId = item.AwayId;
            ticket.SportTypeId = item.SportType;
            ticket.LeagueId = item.LeagueId;
            ticket.IsNeutral = item.IsNeutral;
            ticket.MatchCode = item.MatchCode;
            ticket.WalletType = item.WalletType.SetWalletType(item.RefCode);
            ticket.RefCode = 0;
            ticket.SettlementStatus = item.IsMixParlay ? default(byte) : item.SettlementStatus;
            ticket.IsLive = item.IsLiveIndicator;

            return ticket;
        }

        private string BuildChoice(ITicket ticket, TicketHelper ticketHelper, GetTicketModel item)
        {
            var mainChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
            if (!item.IsMixParlay)
            {
                return mainChoice;
            }
            SetValueSubTicket(ticket, item);
            var subChoice = betListService.BuildChoice(ticket, ticketHelper, null, false);
            var choice = mainChoice.Replace("<div id=", $"<div id='dvFavorite_{item.SubTransId}'>{subChoice}</div><div id=");
            var result = choice + $"<div id='divEvent_{item.SubTransId}'></div>";

            return result;
        }

        private static void SetValueSubTicket(ITicket ticket, GetTicketModel item)
        {
            ticket.BetId = default(long?);
            ticket.OddsType = string.Empty;
            ticket.BetCheck = item.SubBetCheck;
            ticket.BetTeam = item.SubBetTeam;
            ticket.BetTypeId = item.SubBetType;
            ticket.Handicap1 = item.SubHdp1;
            ticket.Handicap2 = item.SubHdp2;
            ticket.Odds = item.SubOdds;
        }
    }
}