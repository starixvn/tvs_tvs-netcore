using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.VoidSingleBet.Models;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface CheckBoxService
{
    bool IsDisable(GetTicketModel item, UserPermission permission);
}

public class CheckBoxServiceImp : CheckBoxService
{
    public bool IsDisable(GetTicketModel item, UserPermission permission)
    {
        int[] betTypesSaba = [228, 229];
        if (DefaultDisable(item, permission))
        {
            return true;
        }

        if (betTypesSaba.Contains(item.BetType))
        {
            return IsDisableBetTypesSabaTicket(item, permission);
        }

        if (DefaultEnable(item.GroupName, permission))
        {
            return false;
        }

        if (IsEnableForCashOut(item, permission))
        {
            return false;
        }

        return CheckStatus(item);
    }

    private static bool DefaultDisable(GetTicketModel item, UserPermission permission)
    {
        return permission.ReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
    }

    private static bool IsDisableBetTypesSabaTicket(GetTicketModel item, UserPermission permission)
    {
        return CheckStatus(item) && !permission.InstantlySettledTicket
                           && !permission.SettledTicket;
    }

    private static bool DefaultEnable(string groupName, UserPermission permission)
    {
        const string instantSettlement = "(instant settlement)";
        return groupName.ToLowerInvariant().Contains(instantSettlement) && permission.InstantlySettledTicket
               || permission.SettledTicket;
    }

    private static bool CheckStatus(GetTicketModel item)
    {
        return item.IsMixParlay ? item.SubStatus.IsSettled() : item.Status.IsSettled();
    }

    private static bool IsEnableForCashOut(GetTicketModel item, UserPermission permission)
    {
        return item.IsCashOut && (permission.InstantlySettledTicket || permission.UnSettledTicket);
    }
}