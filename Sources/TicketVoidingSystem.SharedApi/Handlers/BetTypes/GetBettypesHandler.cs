using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBettypesRequest : GetBetTypesCriteria, IRequest<BetTypesViewModel>
{
}

public class GetBetTypesHandler : IRequestHandler<GetBettypesRequest, BetTypesViewModel>
{
    private readonly BetTypesService betTypeService;

    public GetBetTypesHandler(BetTypesService betTypeService)
    {
        this.betTypeService = betTypeService;
    }

    public async Task<BetTypesViewModel> Handle(GetBettypesRequest message, CancellationToken cancellationToken)
    {
        return await betTypeService.GetBetTypes(message);
    }
}