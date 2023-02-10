using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;

public interface CheckBoxService
{
    bool IsDisable(GetTicketModel item, UserPermission permission);
}

public class CheckBoxServiceImp : CheckBoxService
{
    public bool IsDisable(GetTicketModel item, UserPermission permission)
    {
        return permission.ReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
    }
}