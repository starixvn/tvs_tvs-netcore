using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBetTypesVirtualSportRequest : IRequest<IList<GroupBetTypeVirtualSport>>
{
}

public class GetBetTypesVirtualSportsHandler : IRequestHandler<GetBetTypesVirtualSportRequest, IList<GroupBetTypeVirtualSport>>
{
    private readonly BetTypesService betTypesService;

    public GetBetTypesVirtualSportsHandler(BetTypesService betTypesService)
    {
        this.betTypesService = betTypesService;
    }

    private static IList<GroupBetTypeVirtualSport> GroupBetTypes { get; set; }

    public Task<IList<GroupBetTypeVirtualSport>> Handle(GetBetTypesVirtualSportRequest message, CancellationToken cancellationToken)
    {
        GroupBetTypes ??= betTypesService.GetVirtualSports();
        return Task.FromResult(GroupBetTypes);
    }
}