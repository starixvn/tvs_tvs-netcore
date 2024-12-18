using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByBetId.Services;

public interface RemarkService
{
    Task<IndexViewModel> GetInfo();
}

public class RemarkServiceImp(SessionService sessionService) : RemarkService
{
    public async Task<IndexViewModel> GetInfo()
    {
        return new IndexViewModel
        {
            UserName = sessionService.UserName,
            Permission = new UserPermission
            {
                SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host),
                UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host)
            }
        };
    }
}