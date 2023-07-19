using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;

public interface UserPermissionService
{
    Task<UserPermission> GetUserPermission();
}

public class UserPermissionServiceImp : UserPermissionService
{
    private readonly SessionService sessionService;

    public UserPermissionServiceImp(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

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