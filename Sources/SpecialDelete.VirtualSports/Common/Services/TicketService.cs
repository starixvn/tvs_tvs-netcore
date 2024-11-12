using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VirtualSports.Common.Services;

public interface TicketService
{
    TicketViewModel GetTicket(GetTicketModel item);

    TicketViewModel GetTicket(GetTicketModel item, Recover typeOfRecover);
}

public class TicketServiceImp(
    VoidBetListService voidBetListService,
    RecoverBetListService recoverBetListService)
    : TicketService
{
    public TicketViewModel GetTicket(GetTicketModel item)
    {
        var ticket = voidBetListService.Create(item);
        Mapper(ticket, item);
        return ticket;
    }

    public TicketViewModel GetTicket(GetTicketModel item, Recover typeOfRecover)
    {
        var ticket = recoverBetListService.Create(item, typeOfRecover);
        Mapper(ticket, item);
        return ticket;
    }

    private static void Mapper(TicketViewModel ticket, GetTicketModel item)
    {
        ticket.BetId = item.TransId.ToString();
        ticket.SubTransId = item.SubTransId.ToString();
        ticket.Member = item.UserName;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
    }
}