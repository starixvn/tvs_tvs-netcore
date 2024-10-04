using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoRequest : GetMatchInfoCriteria, IRequest<Match>
{
}

public class GetMatchInfoHandler : IRequestHandler<GetMatchInfoRequest, Match>
{
    private readonly BetListService betListService;
    private readonly MatchService matchService;

    public GetMatchInfoHandler(
        BetListService betListService,
        MatchService matchService)
    {
        this.betListService = betListService;
        this.matchService = matchService;
    }

    public async Task<Match> Handle(GetMatchInfoRequest request, CancellationToken cancellationToken)
    {
        var match = await matchService.GetMatch(request);
        match = matchService.UpdateMatchInfoFromRemotingRef(match);
        if (match != null)
        {
            match.MatchCode = betListService.GetVirtualSportMatchCode(match.SportType, match.MatchCode, match.MatchId);
        }

        return match;
    }
}