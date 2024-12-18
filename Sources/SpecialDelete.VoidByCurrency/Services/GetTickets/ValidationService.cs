using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface ValidationService
{
    bool DisableCheckboxWithPermission(string status, UserPermission permission, string groupName);
}

public class ValidationServiceImp : ValidationService
{
    private const string PhoneBetting = "Phone Betting";

    private static readonly List<string> SettledStatus = [TicketStatus.Draw, TicketStatus.Won, TicketStatus.Lose];

    public bool DisableCheckboxWithPermission(string status, UserPermission permission, string groupName)
    {
        if (groupName == PhoneBetting)
        {
            return !(permission.SettledTicket && SettledStatus.Contains(status.ToLowerInvariant()));
        }

        if (status.Equals(TicketStatus.Sold, StringComparison.OrdinalIgnoreCase) || permission.ReadOnly)
        {
            return true;
        }

        return !permission.SettledTicket && SettledStatus.Contains(status.ToLowerInvariant());
    }
}