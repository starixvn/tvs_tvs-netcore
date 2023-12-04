using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.VoidByBetId.ViewModels;
public class IndexViewModel
{
    public string UserName { get; set; }

    public UserPermission Permission { get; set; }

    public bool IsShowWarning => Permission.SettledTicket || Permission.UnSettledTicket;

    public string Remark => Permission.SettledTicket ? StringResource.Warning_Message_VoidBetId : StringResource.Warning_Message_VoidBetId_UnSettled;
}