using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoVoidByCurrencyRequest : GetMatchInfoVoidByCurrencyCriteria, IRequest<Match>;

public class GetMatchInfoVoidByCurrencyHandler(
    BetListService betListService,
    MatchService matchService)
    : IRequestHandler<GetMatchInfoVoidByCurrencyRequest, Match>
{
    public async Task<Match> Handle(GetMatchInfoVoidByCurrencyRequest request, CancellationToken cancellationToken)
    {
        var match = await matchService.GetMatchVoidByCurrency(request);
        match = matchService.UpdateMatchInfoFromRemotingRef(match);
        if (match != null)
        {
            match.MatchCode = betListService.GetVirtualSportMatchCode(match.SportType, match.MatchCode);
        }

        return match;
    }
}