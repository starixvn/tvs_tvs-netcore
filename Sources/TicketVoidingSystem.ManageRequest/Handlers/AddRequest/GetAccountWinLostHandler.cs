using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetAccountWinLostRequest : GetAccountWinLostCriteria, IRequest<IEnumerable<AccountWinlostModel>>
{
}

public class GetAccountWinLostHandler : IRequestHandler<GetAccountWinLostRequest, IEnumerable<AccountWinlostModel>>
{
    private readonly IDynamicRepository repository;

    public GetAccountWinLostHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<AccountWinlostModel>> Handle(GetAccountWinLostRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<AccountWinlostModel>(request, cancellationToken);
    }
}