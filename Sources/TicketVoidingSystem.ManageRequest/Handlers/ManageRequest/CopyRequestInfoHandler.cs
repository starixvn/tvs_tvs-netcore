using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class CopyRequestInfoRequest : IRequest<CopyRequestInfoResponse>
{
    public int RequestId { get; set; }

    public int MatchId { get; set; }
}

public class CopyRequestInfoHandler : IRequestHandler<CopyRequestInfoRequest, CopyRequestInfoResponse>
{
    private readonly CopyRequestInfoService copyRequestInfoService;

    public CopyRequestInfoHandler(CopyRequestInfoService copyRequestInfoService)
    {
        this.copyRequestInfoService = copyRequestInfoService;
    }

    public async Task<CopyRequestInfoResponse> Handle(CopyRequestInfoRequest request, CancellationToken cancellationToken)
    {
        var (requestInfo, betTypeTickets) = await copyRequestInfoService.GetCopyInfo(request.MatchId, request.RequestId);
        requestInfo.GlobalShowTime = requestInfo.GlobalShowTime.ZoneManila();
        copyRequestInfoService.UpdateMatchInfo(request.MatchId, requestInfo);
        copyRequestInfoService.UpdateBetTypeName(betTypeTickets);
        await copyRequestInfoService.UpdatePlayerNameForBetTypeNextManOut(request.MatchId, betTypeTickets);

        return new CopyRequestInfoResponse
        {
            RequestInfo = requestInfo,
            BetTypeTickets = betTypeTickets
        };
    }
}