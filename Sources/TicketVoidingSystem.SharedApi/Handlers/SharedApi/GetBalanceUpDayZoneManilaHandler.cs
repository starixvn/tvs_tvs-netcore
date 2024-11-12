using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetBalanceUpDayZoneManilaRequest : IRequest<BalanceUp>
{
}

public class GetBalanceUpDayZoneManilaHandler(BalanceUpService balanceUpService)
    : IRequestHandler<GetBalanceUpDayZoneManilaRequest, BalanceUp>
{
    public async Task<BalanceUp> Handle(GetBalanceUpDayZoneManilaRequest request, CancellationToken cancellationToken)
    {
        return await balanceUpService.GetBalanceUpDayZoneManila();
    }
}