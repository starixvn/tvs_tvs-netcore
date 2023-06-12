using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface MapTicketsService
{
    Group<TicketViewModel> MapToGroupTicketViewModel(GroupTicketsMappingParameters parameters);

    TicketViewModel MapFromGetTicketModelToTicketViewModel(GetTicketModel item, Match match, ChoiceType choiceType, int issueTypeId);
}

public class MapTicketsServiceImp : MapTicketsService
{
    private readonly BetListCoreService betListCoreService;

    public MapTicketsServiceImp(BetListCoreService betListCoreService)
    {
        this.betListCoreService = betListCoreService;
    }

    // Jacob Hàm gì mà nhiều parameter thế
    public Group<TicketViewModel> MapToGroupTicketViewModel(GroupTicketsMappingParameters parameters)
    {
        var tickets = new List<TicketViewModel>();
        var index = parameters.StartIndex;

        foreach (var item in parameters.Group.Tickets)
        {
            var ticket = MapFromGetTicketModelToTicketViewModel(item, parameters.Match, ChoiceType.None, parameters.IssueTypeId);
            ticket.No = index++;
            ticket.IsDisable = item.IsDisable(parameters.VoidPermission, parameters.IssueTypeId);
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel>
        {
            Name = parameters.Group.Name,
            Tickets = tickets,
            DisplayTotalTickets = parameters.Group.DisplayTotalTickets
        };
    }

    public TicketViewModel MapFromGetTicketModelToTicketViewModel(GetTicketModel item, Match match, ChoiceType choiceType, int issueTypeId)
    {
        var ticket = betListCoreService.GetTicket(item, match, choiceType, issueTypeId);
        ticket.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        ticket.TransDate = item.TransDate.ToString(FormatKey.DateTimeWithMillisecondAndSlash);
        ticket.Member = string.IsNullOrEmpty(item.FollowedUsername) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUsername})";
        ticket.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticket.Currency = item.CurrencyName;

        ticket.Value = item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString();
        ticket.MainTransId = item.MainTransId.ToString();
        ticket.IsCricket = item.IsCricket;
        ticket.IsParlay = item.IsMixParlay;
        ticket.IsMarked = item.IsMarked;
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.BetTypeId = item.BetType;
        ticket.IsBonus = item.WalletType > 0;
        ticket.IsCancelCashOut = item.IsCancelCashOut;
        return ticket;
    }
}