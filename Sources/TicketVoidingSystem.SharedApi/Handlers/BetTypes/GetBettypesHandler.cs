using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBetTypesRequest : GetBetTypesCriteria, IRequest<BetTypesViewModel>
{
}

public class GetBetTypesHandler(BetTypesRepository betTypesRepository)
    : IRequestHandler<GetBetTypesRequest, BetTypesViewModel>
{
    public async Task<BetTypesViewModel> Handle(GetBetTypesRequest message, CancellationToken cancellationToken)
    {
        return await betTypesRepository.GetBetTypes(message);
    }
}