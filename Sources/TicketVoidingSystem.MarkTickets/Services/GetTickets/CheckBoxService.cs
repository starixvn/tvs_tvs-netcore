namespace TicketVoidingSystem.MarkTickets.Services.GetTickets
{
    using Models;
    using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

    public interface ICheckBoxService
    {
        bool IsDisable(GetTicketModel item, UserPermission permission);
    }

    public class CheckBoxService : ICheckBoxService
    {
        public bool IsDisable(GetTicketModel item, UserPermission permission)
        {
            return permission.ReadOnly || item.MainTransId > 0 && item.MainTransId != item.TransId;
        }
    }
}