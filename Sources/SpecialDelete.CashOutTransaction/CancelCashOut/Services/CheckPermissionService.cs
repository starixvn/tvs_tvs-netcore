using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services;

public interface CheckPermissionService
{
    bool IsDisable(string status, short? statusWinLost, UserPermission permission);
}

public class CheckPermissionServiceImp : CheckPermissionService
{
    public bool IsDisable(string status, short? statusWinLost, UserPermission permission)
    {
        if (permission.ReadOnly)
        {
            return true;
        }

        if (permission.SettledTicket)
        {
            return false;
        }

        return statusWinLost != null && status.IsSettled();
    }
}