using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetDecidedByRequest : GetDecidedByCriteria, IRequest<string[]>
{
}

public class GetDecidedByHandler(GetDecidedByService getDecidedByService)
    : IRequestHandler<GetDecidedByRequest, string[]>
{
    public async Task<string[]> Handle(GetDecidedByRequest request, CancellationToken cancellationToken)
    {
        return await getDecidedByService.GetDecidedBy(request);
    }
}