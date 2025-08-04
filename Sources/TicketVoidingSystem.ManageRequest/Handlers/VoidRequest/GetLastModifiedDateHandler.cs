using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetLastModifiedDateRequest : GetRequestLastModifiedDateCriteria, IRequest<RequestLastModifiedDate>;

public class GetLastModifiedDateHandler(IDynamicRepository repository)
    : IRequestHandler<GetLastModifiedDateRequest, RequestLastModifiedDate>
{
    public async Task<RequestLastModifiedDate> Handle(GetLastModifiedDateRequest request, CancellationToken cancellationToken)
    {
        return await repository.GetAsync<RequestLastModifiedDate>(request);
    }
}