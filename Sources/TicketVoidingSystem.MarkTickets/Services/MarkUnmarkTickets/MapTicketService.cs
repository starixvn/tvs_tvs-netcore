using System;
using System.Collections.Generic;
using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using Fanex.NAP.Core.Business;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets
{
    public interface MapTicketService
    {
        Group<TicketViewModel> MapToGroupTicketViewModel(in Group<GetTicketModel> group);

        IEnumerable<ExcelTicketModel> MapToExcelTicketModel(in IEnumerable<GetTicketModel> data);
    }

    public class MapTicketServiceImp : MapTicketService
    {
        private readonly IMapper mapper;
        private readonly SessionService sessionService;
        private readonly BetListService betListService;
        private readonly CheckBoxService checkBoxService;

        public MapTicketServiceImp(IMapper mapper, SessionService sessionService, BetListService betListService, CheckBoxService checkBoxService)
        {
            this.mapper = mapper;
            this.sessionService = sessionService;
            this.betListService = betListService;
            this.checkBoxService = checkBoxService;
        }

        public Group<TicketViewModel> MapToGroupTicketViewModel(in Group<GetTicketModel> group)
        {
            var permission = new UserPermission
            {
                MarkTickets = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host),
                ViewUserName = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameofSpecialSiteonBetList, Constant.Policy.Read)
            };
            var tickets = new List<TicketViewModel>();
            var index = 1;
            foreach (var item in group.Tickets)
            {
                var ticket = MapToTicketViewModel(item, permission);
                ticket.No = index++;
                if (!permission.ViewUserName && item.GroupName == SpecialSiteConstant.Site789Y)
                {
                    ticket.Member = "-";
                    ticket.Currency = "-";
                }

                tickets.Add(ticket);
            }

            return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
        }

        public IEnumerable<ExcelTicketModel> MapToExcelTicketModel(in IEnumerable<GetTicketModel> data)
        {
            var index = 1;
            var tickets = new List<ExcelTicketModel>();
            var canViewUserName = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameofSpecialSiteonBetList, Constant.Policy.Read);
            foreach (var item in data)
            {
                var ticketDetail = MapToTicketViewModel(item);
                var ticket = mapper.Map<ExcelTicketModel>(ticketDetail);
                ticket.No = index++;
                ticket.BetId = ticketDetail.BetId.LineBreak();
                ticket.Member = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Member.LineBreak();
                ticket.Currency = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Currency.LineBreak();
                ticket.Odds = ticketDetail.Odds.DefaultText();
                ticket.Stake = ticketDetail.Stake.StakeText();
                ticket.Status = ticketDetail.Status.DefaultText();
                ticket.Choice = ticketDetail.Choice.ChoiceSubParlay(item.IsMixParlay);
                tickets.Add(ticket);
            }

            return tickets;
        }

        private TicketViewModel MapToTicketViewModel(GetTicketModel item, UserPermission permission)
        {
            var ticket = MapFromBetListToTicketViewModel(item);
            ticket.IsDisable = checkBoxService.IsDisable(item, permission);
            ticket.Value = item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString();
            ticket.MainTransId = item.MainTransId.ToString();
            ticket.IsCricket = item.IsCricket;
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            return ticket;
        }

        private TicketViewModel MapToTicketViewModel(GetTicketModel item)
        {
            var ticket = MapFromBetListToTicketViewModel(item);
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            return ticket;
        }

        private TicketViewModel MapFromBetListToTicketViewModel(GetTicketModel item)
        {
            var viewModel = new TicketViewModel();
            var ticketHelper = new TicketHelper
            {
                ShowSystemParlayDetail = false,
                IsShowOddsWithChoice = item.IsMixParlay
            };
            var ticket = BuildTicket(item);

            viewModel.Odds = betListService.GetOdds(ticket, false);
            viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
            viewModel.BetType = betListService.GetBetTypeName(ticket);
            viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
            viewModel.Choice = BuildChoice(ticket, ticketHelper, item);
            viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);

            viewModel.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
            viewModel.TransDate = item.TransDate.ToString(FormatKey.DateTimeWithMillisecondAndSlash);
            viewModel.Member = string.IsNullOrEmpty(item.FollowedUsername) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUsername})";
            viewModel.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
            viewModel.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
            viewModel.Currency = item.CurrencyName;

            return viewModel;
        }

        private Ticket BuildTicket(GetTicketModel item)
        {
            var ticket = mapper.Map<Ticket>(item);
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
            var result = choice + $"<div id='divEvent_{item.SubTransId}'></div>";

            return result;
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
        }
    }
}