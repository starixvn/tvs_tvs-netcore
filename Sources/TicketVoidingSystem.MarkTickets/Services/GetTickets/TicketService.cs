namespace TicketVoidingSystem.MarkTickets.Services.GetTickets
{
    using System;
    using Common.Extensions;
    using Core.Constants;
    using Models;
    using ViewModels;

    public interface ITicketService
    {
        TicketViewModel Render(GetTicketModel item, UserPermission permission);

        TicketViewModel Render(GetTicketModel item);
    }

    public class TicketService : ITicketService
    {
        private readonly IBetListCoreService betListCoreService;
        private readonly ICheckBoxService checkBoxService;

        public TicketService(
            IBetListCoreService betListCoreService,
            ICheckBoxService checkBoxService)
        {
            this.betListCoreService = betListCoreService;
            this.checkBoxService = checkBoxService;
        }

        public TicketViewModel Render(GetTicketModel item, UserPermission permission)
        {
            var ticket = MappingFromBetList(item);
            ticket.IsDisable = checkBoxService.IsDisable(item, permission);
            ticket.Value = item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString();
            ticket.MainTransId = item.MainTransId.ToString();
            ticket.IsCricket = item.IsCricket;
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            return ticket;
        }

        public TicketViewModel Render(GetTicketModel item)
        {
            var ticket = MappingFromBetList(item);
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            return ticket;
        }

        private TicketViewModel MappingFromBetList(GetTicketModel item)
        {
            var ticket = betListCoreService.GetTicket(item);
            ticket.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
            ticket.TransDate = item.TransDate.ToString(FormatKey.DateTimeWithMillisecondAndSlash);
            ticket.Member = string.IsNullOrEmpty(item.FollowedUsername) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUsername})";
            ticket.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
            ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
            ticket.Currency = item.CurrencyName;

            return ticket;
        }
    }
}