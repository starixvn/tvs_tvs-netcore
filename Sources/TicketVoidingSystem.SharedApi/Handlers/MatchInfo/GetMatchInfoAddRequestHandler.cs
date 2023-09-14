using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.ViewModels;

namespace TicketVoidingSystem.SharedApi.Handlers.MatchInfo;

public class GetMatchInfoForAddRequest : GetMatchInfoAddRequestCriteria, IRequest<MatchInfoAddRequestViewModel>
{
}

public class GetMatchInfoAddRequestHandler : IRequestHandler<GetMatchInfoForAddRequest, MatchInfoAddRequestViewModel>
{
    private readonly MatchService matchService;

    public GetMatchInfoAddRequestHandler(MatchService matchService)
    {
        this.matchService = matchService;
    }

    public async Task<MatchInfoAddRequestViewModel> Handle(GetMatchInfoForAddRequest request, CancellationToken cancellationToken)
    {
        var result = await matchService.GetMatchAddRequest(request);
        result.Match = matchService.UpdateMatchInfoFromRemotingRef(result.Match);

        return result;
    }
}