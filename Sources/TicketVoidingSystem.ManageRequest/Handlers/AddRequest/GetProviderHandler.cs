using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetProviderRequest : IRequest<Provider>
{
    public int MatchId { get; set; }
}

public class GetProviderHandler(IDynamicRepository repository) : IRequestHandler<GetProviderRequest, Provider>
{
    public async Task<Provider> Handle(GetProviderRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetProviderCriteria
        {
            MatchId = request.MatchId
        };
        var provider = await repository.GetAsync<Provider>(criteria);
        return provider;
    }
}