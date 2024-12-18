using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.CashOutTransaction.CancelCashOut.ViewModels;
using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services;

public interface RemarkService
{
    Task<IndexViewModel> GetInfoPermissionCancelCashOut();
}

public class RemarkServiceImp(SessionService sessionService) : RemarkService
{
    public async Task<IndexViewModel> GetInfoPermissionCancelCashOut()
    {
        return new IndexViewModel
        {
            UserName = sessionService.UserName,
            Permission = new UserPermission
            {
                SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host),
                UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host)
            }
        };
    }
}