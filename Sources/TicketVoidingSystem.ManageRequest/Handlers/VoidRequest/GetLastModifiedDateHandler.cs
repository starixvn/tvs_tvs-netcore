using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetLastModifiedDateRequest : GetRequestLastModifiedDateCriteria, IRequest<RequestLastModifiedDate>
{
}

public class GetLastModifiedDateHandler : IRequestHandler<GetLastModifiedDateRequest, RequestLastModifiedDate>
{
    private readonly IDynamicRepository repository;

    public GetLastModifiedDateHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<RequestLastModifiedDate> Handle(GetLastModifiedDateRequest request, CancellationToken cancellationToken)
    {
        return await repository.GetAsync<RequestLastModifiedDate>(request, cancellationToken);
    }
}