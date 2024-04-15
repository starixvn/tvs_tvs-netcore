using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class CopyRequestInfoRequest : CopyRequestInfoCriteria, IRequest<CopyRequestInfoResponse>
{
}

public class CopyRequestInfoHandler : IRequestHandler<CopyRequestInfoRequest, CopyRequestInfoResponse>
{
    private readonly IDynamicRepository repository;
    private readonly MatchService matchService;

    public CopyRequestInfoHandler(IDynamicRepository repository, MatchService matchService)
    {
        this.repository = repository;
        this.matchService = matchService;
    }

    public async Task<CopyRequestInfoResponse> Handle(CopyRequestInfoRequest request, CancellationToken cancellationToken)
    {
        var (requestInfoList, betTypeTickets) = await repository.FetchMultipleAsync<RequestInfoForCopy, BetTypeTicketsInfo>(request, cancellationToken);
        var requestInfo = requestInfoList.First();
        UpdateMatchInfo(request.MatchId, requestInfo);
        requestInfo.GlobalShowTime = requestInfo.GlobalShowTime.ZoneManila();

        return new CopyRequestInfoResponse
        {
            RequestInfo = requestInfo,
            BetTypeTickets = betTypeTickets
        };
    }

    private void UpdateMatchInfo(int matchId, RequestInfoForCopy requestInfo)
    {
        var match = new Match
        {
            MatchId = matchId,
            HomeId = requestInfo.HomeId,
            AwayId = requestInfo.AwayId,
            LeagueId = requestInfo.LeagueId,
            IsNeutral = requestInfo.IsNeutral
        };
        matchService.UpdateMatchInfoFromRemotingRef(match);

        requestInfo.MatchEvent = match.MatchEvent;
        requestInfo.LeagueName = match.LeagueName;
    }
}