using System.Threading.Tasks;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;

using Fanex.NAP.Client.Helpers.Business;

public interface UserPermissionService
{
    Task<UserPermission> GetUserPermission();
}

public class UserPermissionServiceImp(SessionService sessionService) : UserPermissionService
{
    public async Task<UserPermission> GetUserPermission()
    {
        var markTicketsPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host);
        var viewUserNamePermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameOfSpecialSiteOnBetList, Constant.Policy.Read);

        await Task.WhenAll(markTicketsPermissionTask, viewUserNamePermissionTask);

        return new UserPermission
        {
            MarkTickets = await markTicketsPermissionTask,
            ViewUserName = await viewUserNamePermissionTask
        };
    }
}