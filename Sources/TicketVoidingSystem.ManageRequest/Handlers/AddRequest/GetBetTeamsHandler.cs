using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetBetTeamsRequest : IRequest<IEnumerable<BetTeamAddRequest>>
{
}

public class GetBetTeamsHandler : IRequestHandler<GetBetTeamsRequest, IEnumerable<BetTeamAddRequest>>
{
    private readonly AdvancedModeService advancedModeService;

    public GetBetTeamsHandler(AdvancedModeService advancedModeService)
    {
        this.advancedModeService = advancedModeService;
    }

    private static IEnumerable<BetTeamAddRequest> BetTeams { get; set; }

    public async Task<IEnumerable<BetTeamAddRequest>> Handle(GetBetTeamsRequest request, CancellationToken cancellationToken)
    {
        BetTeams ??= advancedModeService.GetBetTeams();
        return await Task.FromResult(BetTeams);
    }
}