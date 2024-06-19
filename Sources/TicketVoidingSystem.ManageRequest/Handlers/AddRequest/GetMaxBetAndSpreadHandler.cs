using MediatR;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetMaxBetAndSpreadRequest : OddsInfoRequest, IRequest<OddsInfoModel>
{
}

public class GetMaxBetAndSpreadHandler : IRequestHandler<GetMaxBetAndSpreadRequest, OddsInfoModel>
{
    public async Task<OddsInfoModel> Handle(GetMaxBetAndSpreadRequest request, CancellationToken cancellationToken)
    {
    }
}