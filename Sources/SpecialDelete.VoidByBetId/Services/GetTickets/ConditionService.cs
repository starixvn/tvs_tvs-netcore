using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.VoidByBetId.Services.GetTickets;

public interface ConditionService
{
    bool IsDisableCheckBox(GetTicketModel item, UserPermission permission, bool isVoidByBetId);

    bool IsNetPosition(int betType, bool isDeposit);
}

public class ConditionServiceImp : ConditionService
{
    public bool IsDisableCheckBox(GetTicketModel item, UserPermission permission, bool isVoidByBetId)
    {
        const string phoneBetting = "Phone Betting";
        var settledStatus = new List<string> { TicketStatus.Draw, TicketStatus.Won, TicketStatus.Lose };
        if (item.GroupName.Equals(phoneBetting, StringComparison.OrdinalIgnoreCase))
        {
            if (!isVoidByBetId && permission.SettledTicket)
            {
                return false;
            }

            return !(permission.SettledTicket && settledStatus.Contains(item.Status.ToLowerInvariant()));
        }

        if (item.MainTransId > 0 && item.MainTransId != item.TransId || permission.ReadOnly)
        {
            return true;
        }

        return !permission.SettledTicket && settledStatus.Contains(item.Status.ToLowerInvariant());
    }

    public bool IsNetPosition(int betType, bool isDeposit)
    {
        const int betTypeCricket = 501;
        return betType == betTypeCricket && !isDeposit;
    }
}