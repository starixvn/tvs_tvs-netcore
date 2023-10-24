using SpecialDelete.VoidByCurrency.Models;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface CheckBoxService
{
    bool IsDisable(GetTicketModel item, UserPermission userPermission);
}

public class CheckBoxServiceImp : CheckBoxService
{
    private readonly ValidationService validationService;

    public CheckBoxServiceImp(ValidationService validationService)
    {
        this.validationService = validationService;
    }

    public bool IsDisable(GetTicketModel item, UserPermission userPermission)
    {
        var disableWithStatus = validationService.DisableCheckboxWithPermission(item.Status, userPermission, item.GroupName);
        var disableWithSubStatus = validationService.DisableCheckboxWithPermission(item.SubStatus, userPermission, item.GroupName);

        var isSubTicket = item.MainTransId > 0 && item.MainTransId != item.TransId;
        var isDisableWithSingleTicket = !item.IsMixParlay && !item.IsCashOut && disableWithStatus;
        var isDisableWithCashOutTicket = item.IsCashOut && userPermission.ReadOnly;
        var isDisableWithParlayPermission = item.IsMixParlay && disableWithSubStatus;

        return isSubTicket || isDisableWithSingleTicket || isDisableWithCashOutTicket || isDisableWithParlayPermission;
    }
}