using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetVoidActionsRequest : GetActionsCriteria, IRequest<IEnumerable<VoidActionSelection>>;

public class GetVoidActionsHandler(IDynamicRepository repository)
    : IRequestHandler<GetVoidActionsRequest, IEnumerable<VoidActionSelection>>
{
    public async Task<IEnumerable<VoidActionSelection>> Handle(GetVoidActionsRequest request, CancellationToken cancellationToken)
    {
        var data = await repository.FetchAsync<VoidAction>(request);
        return data
            .Select(x => new VoidActionSelection { Name = x.ActionName, Value = x.ActionId });
    }
}