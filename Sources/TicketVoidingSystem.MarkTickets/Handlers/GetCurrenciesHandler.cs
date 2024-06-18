using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers;

public class GetCurrenciesRequest : GetCurrenciesCriteria, IRequest<IEnumerable<Currency>>
{
}

public class GetCurrenciesHandler : IRequestHandler<GetCurrenciesRequest, IEnumerable<Currency>>
{
    private readonly IDynamicRepository repository;

    public GetCurrenciesHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<Currency>> Handle(GetCurrenciesRequest request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<Currency>(request);
    }
}