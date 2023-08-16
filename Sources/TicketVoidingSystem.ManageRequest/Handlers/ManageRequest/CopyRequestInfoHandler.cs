using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class CopyRequestInfoRequest : CopyRequestInfoCriteria, IRequest<CopyRequestInfoModel>
{
}

public class CopyRequestInfoHandler : IRequestHandler<CopyRequestInfoRequest, CopyRequestInfoModel>
{
    private readonly IDynamicRepository repository;
    private readonly MatchService matchService;

    public CopyRequestInfoHandler(IDynamicRepository repository, MatchService matchService)
    {
        this.repository = repository;
        this.matchService = matchService;
    }

    public async Task<CopyRequestInfoModel> Handle(CopyRequestInfoRequest request, CancellationToken cancellationToken)
    {
        var model = await repository.GetAsync<CopyRequestInfoModel>(request, cancellationToken);
        var match = new Match
        {
            MatchId = request.MatchId,
            HomeId = model.HomeId,
            AwayId = model.AwayId,
            LeagueId = model.LeagueId,
            IsNeutral = model.IsNeutral
        };
        matchService.UpdateMatchInfoFromRemotingRef(match);
        model.MatchEvent = match.MatchEvent;
        model.LeagueName = match.LeagueName;
        model.GlobalShowTime = model.GlobalShowTime.ZoneManila();

        return model;
    }
}