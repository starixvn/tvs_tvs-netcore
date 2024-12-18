using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Extension;

public static class CheckBoxExtension
{
    private static readonly List<string> SpecialGroup = ["phone betting"];

    public static bool IsDisable(this GetTicketModel item, VoidPermission permission, int issueTypeId)
    {
        var betTypesSaba = new List<int> { 228, 229 };
        if (DefaultDisable(item, permission))
        {
            return true;
        }

        if (betTypesSaba.Contains(item.BetType))
        {
            return IsDisableBetTypesSabaTicket(permission);
        }

        if (item.IsCancelCashOut)
        {
            return IsDisableCancelCashOutTickets(item, permission);
        }

        if (DefaultEnable(item.GroupName, permission) || IsCashOutTicketAsUnSettled(item, permission, issueTypeId))
        {
            return false;
        }

        return CheckStatus(item);
    }

    private static bool IsDisableCancelCashOutTickets(this GetTicketModel item, VoidPermission permission)
    {
        if ((permission.UnSettled || permission.InstantlySettled) && item.StatusWinLost == null)
        {
            return false;
        }

        return !(permission.Settled && item.StatusWinLost != null);
    }

    private static bool IsDisableBetTypesSabaTicket(VoidPermission permission)
    {
        return !permission.InstantlySettled;
    }

    private static bool DefaultDisable(GetTicketModel item, VoidPermission permission)
    {
        return permission.ReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
    }

    private static bool DefaultEnable(string groupName, VoidPermission permission)
    {
        const string instantSettlement = "(instant settlement)";
        if (groupName.ToLowerInvariant().Contains(instantSettlement))
        {
            return permission.InstantlySettled || permission.Settled;
        }

        return permission.Settled;
    }

    private static bool IsCashOutTicketAsUnSettled(GetTicketModel item, VoidPermission permission, int issueTypeId)
    {
        return item.IsCashOut && !IsRequiredPermissionSettledTickets(issueTypeId) && (permission.UnSettled || permission.InstantlySettled);
    }

    private static bool IsRequiredPermissionSettledTickets(int issueTypeId)
    {
        return issueTypeId.IsAbnormalAccount() || issueTypeId.IsAbnormalBet() || issueTypeId.IsArchivedTicket();
    }

    private static bool CheckStatus(GetTicketModel item)
    {
        return item.IsMixParlay ? item.SubStatus.IsSettled() : item.Status.IsSettled();
    }

    public static bool IsUncheck(this string groupName)
    {
        return SpecialGroup.Contains(groupName.ToLowerInvariant());
    }

    public static bool IsSettledTicket(this GetTicketModel item)
    {
        return CheckStatus(item);
    }
}