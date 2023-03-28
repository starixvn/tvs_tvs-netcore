using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesRequest : BetTypeQueryModel, IRequest<GroupBetTypesViewModel>
{
}

public class GetGroupBetTypesHandler : IRequestHandler<GetGroupBetTypesRequest, GroupBetTypesViewModel>
{
    private readonly BetTypesService betTypeService;

    public GetGroupBetTypesHandler(BetTypesService betTypeService)
    {
        this.betTypeService = betTypeService;
    }

    public async Task<GroupBetTypesViewModel> Handle(GetGroupBetTypesRequest request, CancellationToken cancellationToken)
    {
        return await betTypeService.GetGroupBetTypes(request);
    }
}