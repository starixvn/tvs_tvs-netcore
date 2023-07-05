using Fanex.Data.Repository;
using Fanex.NAP.Core.Business;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface CheckPermissionOnRequestService
{
    Task<bool> IsHasPermissionOnRequest(int requestId);

    Task<VoidPermission> GetVoidPermission();
}

public class CheckPermissionOnRequestServiceImp : CheckPermissionOnRequestService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public CheckPermissionOnRequestServiceImp(IDynamicRepository repository, SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<bool> IsHasPermissionOnRequest(int requestId)
    {
        var criteria = new GetRequestCriteria
        {
            RequestId = requestId
        };
        var request = await repository.GetAsync<RequestModel>(criteria);
        if (request != null)
        {
            var issueTypeId = request.IssueTypeId;
            var permissionConfig = PermissionIssueTypeConfig.MappingList.FirstOrDefault(x => x.IssueTypeId == issueTypeId);

            return await sessionService.HasPermission(permissionConfig.FunctionKey, Constant.Policy.Read);
        }

        return false;
    }

    public async Task<VoidPermission> GetVoidPermission()
    {
        var settledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host);
        var unSettledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host);
        var instantlySettledPermissionTask = sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host);

        await Task.WhenAll(settledPermissionTask, unSettledPermissionTask, instantlySettledPermissionTask);

        return new VoidPermission
        {
            Settled = settledPermissionTask.Result,
            UnSettled = unSettledPermissionTask.Result,
            InstantlySettled = instantlySettledPermissionTask.Result
        };
    }
}