using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VoidByBetId.Services.GetTickets;

public interface TicketService
{
    TicketViewModel GetTicket(GetTicketModel item, UserPermission permission, bool isVoidByBetId);

    TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType);
}

public class TicketServiceImp : TicketService
{
    private readonly BetListCoreService betListCoreService;
    private readonly ConditionService conditionService;

    public TicketServiceImp(
        BetListCoreService betListCoreService,
        ConditionService conditionService)
    {
        this.betListCoreService = betListCoreService;
        this.conditionService = conditionService;
    }

    public TicketViewModel GetTicket(GetTicketModel item, UserPermission permission, bool isVoidByBetId)
    {
        var ticket = Mapping(item, ChoiceType.Html);
        ticket.IsDisable = conditionService.IsDisableCheckBox(item, permission, isVoidByBetId);
        ticket.IsCricket = conditionService.IsNetPosition(item.BetType, item.IsDeposit);
        ticket.Value = item.TransId.ToString();

        return ticket;
    }

    public TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType)
    {
        return Mapping(item, choiceType);
    }

    private TicketViewModel Mapping(GetTicketModel item, ChoiceType choiceType)
    {
        var ticket = betListCoreService.Create(item, choiceType);
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLost = item.Status.IsRunningOrWaiting() ?
            "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##") + GetCommission(item);
        ticket.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
        ticket.Player = string.IsNullOrEmpty(item.FollowedUserName) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUserName})";
        ticket.BetType = item.BetType;
        ticket.MainTransId = item.MainTransId.ToString();
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.IsMarked = item.IsMarked;
        return ticket;
    }

    private static string GetCommission(GetTicketModel item)
    {
        return item.IsHideComm ? string.Empty : $"<br>{item.Commission:0.##}";
    }
}