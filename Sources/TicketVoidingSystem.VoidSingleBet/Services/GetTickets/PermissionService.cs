using Fanex.NAP.Core.Business;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface PermissionService
{
    Task<UserPermission> GetUserPermission();
}

public class PermissionServiceImp : PermissionService
{
    private readonly SessionService sessionService;

    public PermissionServiceImp(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    public async Task<UserPermission> GetUserPermission()
    {
        var settledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host);
        var unSettledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host);
        var instantlySettledTicketPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host);

        await Task.WhenAll(settledTicketPermissionTask, unSettledTicketPermissionTask, instantlySettledTicketPermissionTask);

        return new UserPermission
        {
            SettledTicket = await settledTicketPermissionTask,
            UnSettledTicket = await unSettledTicketPermissionTask,
            InstantlySettledTicket = await instantlySettledTicketPermissionTask
        };
    }
}