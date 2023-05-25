using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class SelectRequestsRequest : SelectRequestsQuery, IRequest<IEnumerable<RequestViewModel>>
{
}

public class SelectRequestsHandler : IRequestHandler<SelectRequestsRequest, IEnumerable<RequestViewModel>>
{
    private readonly GetRequestsService getRequestsService;
    private readonly RenderRequestService renderService;
    private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;

    public SelectRequestsHandler(
        GetRequestsService getRequestsService,
        RenderRequestService renderService,
        CheckPermissionOnRequestService checkPermissionOnRequestService)
    {
        this.getRequestsService = getRequestsService;
        this.renderService = renderService;
        this.checkPermissionOnRequestService = checkPermissionOnRequestService;
    }

    public async Task<IEnumerable<RequestViewModel>> Handle(SelectRequestsRequest request, CancellationToken cancellationToken)
    {
        const string NA_OPTION = "-1";
        if (request.IssueTypeId.Equals(NA_OPTION) || string.IsNullOrEmpty(request.SubIssueType)
        || (!string.IsNullOrWhiteSpace(request.RequestId) && !await checkPermissionOnRequestService.IsHasPermissionOnRequest(int.Parse(request.RequestId))))
        {
            return new List<RequestViewModel>();
        }

        var viewModels = new List<RequestViewModel>();
        var (models, _) = await getRequestsService.GetRequests(request);

        var groupRequestModels = models.GroupBy(b => b.RequestId).Select(group => new GroupRequestModel
        {
            RequestId = group.Key,
            RequestModels = group.ToList(),
        });
        foreach (var groupRequest in groupRequestModels)
        {
            RenderViewModel(viewModels, groupRequest);
        }

        return viewModels;
    }

    private void RenderViewModel(IList<RequestViewModel> viewModels, GroupRequestModel groupRequest)
    {
        var viewModel = renderService.Render(groupRequest);
        viewModels.Add(viewModel);
    }
}