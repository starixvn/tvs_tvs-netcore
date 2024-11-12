using SpecialDelete.VoidByCurrency.Models;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface CheckBoxService
{
    bool IsDisable(GetTicketModel item, UserPermission userPermission);
}

public class CheckBoxServiceImp(ValidationService validationService) : CheckBoxService
{
    public bool IsDisable(GetTicketModel item, UserPermission userPermission)
    {
        var disableWithStatus = validationService.DisableCheckboxWithPermission(item.Status, userPermission, item.GroupName);
        var disableWithSubStatus = validationService.DisableCheckboxWithPermission(item.SubStatus, userPermission, item.GroupName);

        var isSubTicket = item.MainTransId > 0 && item.MainTransId != item.TransId;
        var isDisableWithSingleTicket = item is { IsMixParlay: false, IsCashOut: false } && disableWithStatus;
        var isDisableWithCashOutTicket = item.IsCashOut && userPermission.ReadOnly;
        var isDisableWithParlayPermission = item.IsMixParlay && disableWithSubStatus;

        return isSubTicket || isDisableWithSingleTicket || isDisableWithCashOutTicket || isDisableWithParlayPermission;
    }
}