using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.ViewModels;

public class IndexViewModel
{
    public string UserName { get; set; }

    public UserPermission Permission { get; set; }

    public bool IsShowRemark => Permission.SettledTicket || Permission.UnSettledTicket;

    public string Remark => Permission.SettledTicket
        ? StringResource.You_can_void_Settled_or_Unsettled_tickets
        : StringResource.You_only_void_Unsettled_tickets;
}