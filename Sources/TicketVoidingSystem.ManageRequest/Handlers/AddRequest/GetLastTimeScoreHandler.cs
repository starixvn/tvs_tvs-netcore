using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLastTimeScoreRequest : GetLastTimeScoreModel, IRequest<GetLastTimeScoreViewModel>;

public class GetLastTimeScoreHandler(OnlineServerRepository onlineServerRepository)
    : IRequestHandler<GetLastTimeScoreRequest, GetLastTimeScoreViewModel>
{
    public async Task<GetLastTimeScoreViewModel> Handle(GetLastTimeScoreRequest request, CancellationToken cancellationToken)
    {
        var result = await GetLastTime(request);
        return new GetLastTimeScoreViewModel
        {
            ScoreId = request.ScoreId,
            LastTime = result.LastTime
        };
    }

    private async Task<GetLastTimeScoreViewModel> GetLastTime(GetLastTimeScoreRequest request)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = new GetLastTimeScoreCriteria
        {
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