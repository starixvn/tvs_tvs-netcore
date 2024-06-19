using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetMaxBetAndSpreadRequest : OddsInfoRequest, IRequest<OddsInfoModel>
{
}

public class GetMaxBetAndSpreadHandler : IRequestHandler<GetMaxBetAndSpreadRequest, OddsInfoModel>
{
    private readonly OWPMaxBetAndSpreadService maxBetAndSpreadService;

    public GetMaxBetAndSpreadHandler(OWPMaxBetAndSpreadService maxBetAndSpreadService)
    {
        this.maxBetAndSpreadService = maxBetAndSpreadService;
    }

    public async Task<OddsInfoModel> Handle(GetMaxBetAndSpreadRequest request, CancellationToken cancellationToken)
    {
        return await maxBetAndSpreadService.GetMaxBetAndSpread(request);
    }
}