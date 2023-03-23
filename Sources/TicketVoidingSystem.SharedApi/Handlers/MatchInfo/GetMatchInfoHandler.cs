using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.MatchInfo;

namespace TicketVoidingSystem.SharedApi.Handlers.MatchInfo
{
    public class GetMatchInfoRequest : GetMatchInfoCriteria, IRequest<Match>
    {
    }

    public class GetMatchInfoHandler : IRequestHandler<GetMatchInfoRequest, Match>
    {
        private readonly IDynamicRepository repository;
        private readonly BetListService betListService;
        private readonly MatchService matchService;

        public GetMatchInfoHandler(
            IDynamicRepository repository,
            BetListService betListService,
            MatchService matchService)
        {
            this.repository = repository;
            this.betListService = betListService;
            this.matchService = matchService;
        }

        public async Task<Match> Handle(GetMatchInfoRequest request, CancellationToken cancellationToken)
        {
            var match = await repository.GetAsync<Match>(request, cancellationToken);
            match = matchService.UpdateDataFromRemotingRef(match);
            if (match != null && match.SportType.IsVirtualSport())
            {
                match.MatchCode = betListService.GetMatchCodeBetradar(match.MatchCode);
            }

            return match;
        }
    }
}