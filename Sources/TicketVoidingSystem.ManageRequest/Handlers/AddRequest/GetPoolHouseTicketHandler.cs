using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetPoolHouseTicketRequest : GetPoolHouseTicketQuery, IRequest<GetPoolHouseTicketViewModel>;

public class GetPoolHouseTicketHandler(GetPoolHouseTicketService getPoolHouseTicketService)
    : IRequestHandler<GetPoolHouseTicketRequest, GetPoolHouseTicketViewModel>
{
    public async Task<GetPoolHouseTicketViewModel> Handle(GetPoolHouseTicketRequest request, CancellationToken cancellationToken)
    {
        return await getPoolHouseTicketService.Get(request);
    }
}