using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetProviderRequest : IRequest<Provider>
{
    public int MatchId { get; set; }
}

public class GetProviderHandler : IRequestHandler<GetProviderRequest, Provider>
{
    private readonly IDynamicRepository repository;

    public GetProviderHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<Provider> Handle(GetProviderRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetProviderCriteria
        {
            MatchId = request.MatchId
        };
        var provider = await repository.GetAsync<Provider>(criteria, cancellationToken);
        return provider;
    }
}