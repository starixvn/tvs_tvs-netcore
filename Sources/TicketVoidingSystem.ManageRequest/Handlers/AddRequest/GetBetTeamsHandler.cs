using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetBetTeamsRequest : IRequest<IEnumerable<BetTeamAddRequest>>;

public class GetBetTeamsHandler(AdvancedModeService advancedModeService)
    : IRequestHandler<GetBetTeamsRequest, IEnumerable<BetTeamAddRequest>>
{
    private static IEnumerable<BetTeamAddRequest> BetTeams { get; set; }

    public async Task<IEnumerable<BetTeamAddRequest>> Handle(GetBetTeamsRequest request, CancellationToken cancellationToken)
    {
        BetTeams ??= advancedModeService.GetBetTeams();
        return await Task.FromResult(BetTeams);
    }
}