using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetBalanceUpDayZoneManilaRequest : IRequest<BalanceUp>
{
}

public class GetBalanceUpDayZoneManilaHandler : IRequestHandler<GetBalanceUpDayZoneManilaRequest, BalanceUp>
{
    private readonly BalanceUpService balanceUpService;

    public GetBalanceUpDayZoneManilaHandler(BalanceUpService balanceUpService)
    {
        this.balanceUpService = balanceUpService;
    }

    public async Task<BalanceUp> Handle(GetBalanceUpDayZoneManilaRequest request, CancellationToken cancellationToken)
    {
        return await balanceUpService.GetBalanceUpDayZoneManila();
    }
}