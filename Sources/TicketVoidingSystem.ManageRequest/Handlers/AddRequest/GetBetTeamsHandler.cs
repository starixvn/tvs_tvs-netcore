using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.WrongMarketOffered;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetBetTeamsRequest : IRequest<IEnumerable<BetTeamAddRequest>>
{
}

public class GetBetTeamsHandler : IRequestHandler<GetBetTeamsRequest, IEnumerable<BetTeamAddRequest>>
{
    private readonly WrongMarketOfferedService betTeamsService;

    public GetBetTeamsHandler(WrongMarketOfferedService betTeamsService)
    {
        this.betTeamsService = betTeamsService;
    }

    private static IEnumerable<BetTeamAddRequest> BetTeams { get; set; }

    public async Task<IEnumerable<BetTeamAddRequest>> Handle(GetBetTeamsRequest request, CancellationToken cancellationToken)
    {
        BetTeams ??= betTeamsService.GetBetTeams();
        return await Task.FromResult(BetTeams);
    }
}