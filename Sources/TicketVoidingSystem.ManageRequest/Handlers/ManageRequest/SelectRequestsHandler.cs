using MediatR;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class SelectRequestsRequest : SelectRequestsQuery, IRequest<IEnumerable<RequestViewModel>>;

public class SelectRequestsHandler(
    GetRequestsService getRequestsService,
    RenderRequestService renderService,
    CheckPermissionOnRequestService checkPermissionOnRequestService)
    : IRequestHandler<SelectRequestsRequest, IEnumerable<RequestViewModel>>
{
    public async Task<IEnumerable<RequestViewModel>> Handle(SelectRequestsRequest request, CancellationToken cancellationToken)
    {
        if (await IsFilterSearchRequestsValid(request))
        {
            return new List<RequestViewModel>();
        }

        var (models, _) = await getRequestsService.GetRequests(request);

        var groupRequestModels = models
            .GroupBy(b => b.RequestId)
            .Select(group => new GroupRequestModel
            {
                RequestId = group.Key,
                RequestModels = group.ToList()
            });
        var viewModels = groupRequestModels.Select(renderService.Render);

        return viewModels;
    }

    private async Task<bool> IsFilterSearchRequestsValid(SelectRequestsQuery query)
    {
        if (!string.IsNullOrWhiteSpace(query.MatchId) && !int.TryParse(query.MatchId, out _))
        {
            return true;
        }
        if (!string.IsNullOrWhiteSpace(query.RequestId) && !int.TryParse(query.RequestId, out _))
        {
            return true;
        }

        const string NA_OPTION = "-1";
        return query.IssueTypeId.Equals(NA_OPTION) || string.IsNullOrEmpty(query.SubIssueType)
                                                   || (!string.IsNullOrWhiteSpace(query.RequestId) && !await checkPermissionOnRequestService.IsHasPermissionOnRequest(int.Parse(query.RequestId)));
    }
}