using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBetTypesVoidParlayVirtualSportRequest : IRequest<IList<GroupBetTypeVoidParlayVirtualSport>>;

public class GetBetTypesVoidParlayVirtualSportsHandler(BetTypesRepository betTypesRepository)
    : IRequestHandler<GetBetTypesVoidParlayVirtualSportRequest, IList<GroupBetTypeVoidParlayVirtualSport>>
{
    private static IList<GroupBetTypeVoidParlayVirtualSport> GroupBetTypes { get; set; }

    public Task<IList<GroupBetTypeVoidParlayVirtualSport>> Handle(GetBetTypesVoidParlayVirtualSportRequest message, CancellationToken cancellationToken)
    {
        GroupBetTypes ??= betTypesRepository.GetVoidParlayVirtualSportsBetTypes();
        return Task.FromResult(GroupBetTypes);
    }
}