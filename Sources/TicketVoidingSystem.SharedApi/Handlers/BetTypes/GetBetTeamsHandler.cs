using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBetTeamsRequest : IRequest<IEnumerable<BetTeam>>;

public class GetBetTeamsHandler(BetTeamsService betTeamsService)
    : IRequestHandler<GetBetTeamsRequest, IEnumerable<BetTeam>>
{
    private static IEnumerable<BetTeam> BetTeams { get; set; }

    public async Task<IEnumerable<BetTeam>> Handle(GetBetTeamsRequest request, CancellationToken cancellationToken)
    {
        BetTeams ??= betTeamsService.Get();
        return await Task.FromResult(BetTeams);
    }
}