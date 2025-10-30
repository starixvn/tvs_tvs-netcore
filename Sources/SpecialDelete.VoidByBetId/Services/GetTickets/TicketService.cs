using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VoidByBetId.Services.GetTickets;

public interface TicketService
{
    TicketViewModel GetTicket(GetTicketModel item, UserPermission permission);

    TicketViewModel GetTicket(GetTicketModel item, ChoiceType choiceType);
}

public class TicketServiceImp(
    BetListCoreService betListCoreService,
    ConditionService conditionService)
    : TicketService
{
    public TicketViewModel GetTicket(GetTicketModel item, UserPermission permission)
    {
        var ticket = Mapping(item, ChoiceType.Html);
        ticket.IsDisable = conditionService.IsDisableCheckBox(item, permission);
        ticket.IsCricket = conditionService.IsNetPosition(item.BetType, item.IsDeposit);
        ticket.Value = item.TransId.ToString();
        ticket.BetdaqId = item.BetdaqId;

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
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ?
            "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##") + GetCommission(item);
        ticket.BetId = item.FollowedId > 0 ? $"{item.TransId}<br>(Follow: {item.FollowedId})" : item.TransId.ToString();
        ticket.Member = string.IsNullOrEmpty(item.FollowedUserName) ? item.UserName : $"{item.UserName}<br>(Follow: {item.FollowedUserName})";
        ticket.MainTransId = item.MainTransId.ToString();
        ticket.SiteDbGroupId = item.SiteDbGroupId;
        ticket.IsMarked = item.IsMarked;
        ticket.Currency = item.CurrencyName;
        ticket.SubTransId = item.SubTransId;
        ticket.IsHybrid = item.IsHybrid;
        ticket.SecondAcceptFlag = item.SecAcceptFlag ? "<i class=\"fa-solid fa-check\"></i>" : string.Empty;

        return ticket;
    }

    private static string GetCommission(GetTicketModel item)
    {
        return item.IsHideComm ? string.Empty : $"<br>{item.Commission:0.##}";
    }
}