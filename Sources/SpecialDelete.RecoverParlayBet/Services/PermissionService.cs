using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverParlayBet.Services;

public interface PermissionService
{
    Task<PermissionViewModel> GetPermission();
}

public class PermissionServiceImp(SessionService sessionService) : PermissionService
{
    public async Task<PermissionViewModel> GetPermission()
    {
        return new PermissionViewModel
        {
            HasMainPermission = await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverMainParlayBet, Constant.Policy.Read),
            HasSubPermission = await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverSubParlayBet, Constant.Policy.Read)
        };
    }
}