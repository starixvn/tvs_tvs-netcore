using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VoidByCurrency.Services.GetTickets;

public interface TicketService
{
    TicketViewModel GetTicketDetail(GetTicketModel item, UserPermission userPermission, bool isOutright);

    TicketViewModel GetTicketDetail(GetTicketModel item, bool isOutright);
}

public class TicketServiceImp : TicketService
{
    private readonly BetListCoreService betListCoreService;
    private readonly CheckBoxService checkBoxService;

    public TicketServiceImp(
        BetListCoreService betListCoreService,
        CheckBoxService checkBoxService)
    {
        this.betListCoreService = betListCoreService;
        this.checkBoxService = checkBoxService;
    }

    public TicketViewModel GetTicketDetail(GetTicketModel item, UserPermission userPermission, bool isOutright)
    {
        var ticketDetail = isOutright ? betListCoreService.GetOutrightTicket(item) : betListCoreService.GetTicket(item);
        SetOthersParam(ticketDetail, item);
        ticketDetail.IsDisable = checkBoxService.IsDisable(item, userPermission);

        return ticketDetail;
    }

    public TicketViewModel GetTicketDetail(GetTicketModel item, bool isOutright)
    {
        var ticketDetail = isOutright ? betListCoreService.GetOutrightTicket(item) : betListCoreService.GetTicket(item);
        SetOthersParam(ticketDetail, item);

        return ticketDetail;
    }

    private static void SetOthersParam(TicketViewModel ticketDetail, GetTicketModel item)
    {
        ticketDetail.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticketDetail.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
        ticketDetail.SecondAcceptFlag = item.IsSecondAcceptFlag ? "<span class='icon-tick'></span>" : string.Empty;
    }
}