using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLastTimeScoreRequest : GetLastTimeScoreModel, IRequest<GetLastTimeScoreViewModel>;

public class GetLastTimeScoreHandler(OnlineServerRepository onlineServerRepository)
    : IRequestHandler<GetLastTimeScoreRequest, GetLastTimeScoreViewModel>
{
    public async Task<GetLastTimeScoreViewModel> Handle(GetLastTimeScoreRequest request, CancellationToken cancellationToken)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(x => GetTimeByServer(x.Id, request));
        var times = await Task.WhenAll(tasks);
        var maxLastTime = times.Max(x => x.LastTime);

        return new GetLastTimeScoreViewModel
        {
            ScoreId = request.ScoreId,
            LastTime = maxLastTime
        };
    }

    private async Task<GetLastTimeScoreViewModel> GetTimeByServer(int siteDbGroupId, GetLastTimeScoreRequest request)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = new GetLastTimeScoreCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            MatchId = request.MatchId,
            ActionId = request.ActionId,
            FilterBy = request.FilterBy,
            FilterFromTransTime = request.FilterFromTransTime,
            OnlineServerId = currentOnlineServerId
        };

        var results = await onlineServerRepository.FetchAsync<GetLastTimeScoreViewModel>(criteria);

        return results.MaxBy(x => x.LastTime);
    }
}