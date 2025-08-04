using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

using Fanex.NAP.Client.Helpers.Business;

public interface CheckPermissionOnRequestService
{
    Task<bool> IsHasPermissionOnRequest(int requestId);

    Task<VoidPermission> GetVoidPermission();
}

public class CheckPermissionOnRequestServiceImp(IDynamicRepository repository, SessionService sessionService)
    : CheckPermissionOnRequestService
{
    public async Task<bool> IsHasPermissionOnRequest(int requestId)
    {
        var criteria = new GetRequestCriteria
        {
            RequestId = requestId
        };
        var (firstResultSet, _, _) = await repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, PlayerName>(criteria);

        if (!firstResultSet.Any())
        {
            return false;
        }

        var issueTypeId = firstResultSet.First().IssueTypeId;
        var permissionConfig = PermissionIssueTypeConfig.MappingList.First(x => x.IssueTypeId == issueTypeId);

        return await sessionService.HasPermission(permissionConfig.FunctionKey, Constant.Policy.Read);
    }

    public async Task<VoidPermission> GetVoidPermission()
    {
        var settledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host);
        var unSettledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host);
        var instantlySettledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host);

        await Task.WhenAll(settledPermissionTask, unSettledPermissionTask, instantlySettledPermissionTask);

        return new VoidPermission
        {
            Settled = await settledPermissionTask,
            UnSettled = await unSettledPermissionTask,
            InstantlySettled = await instantlySettledPermissionTask
        };
    }
}