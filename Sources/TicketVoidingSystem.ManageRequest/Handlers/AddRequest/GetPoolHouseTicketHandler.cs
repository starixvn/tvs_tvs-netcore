using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;
using TicketVoidingSystem.ManageRequest.ViewModels;

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