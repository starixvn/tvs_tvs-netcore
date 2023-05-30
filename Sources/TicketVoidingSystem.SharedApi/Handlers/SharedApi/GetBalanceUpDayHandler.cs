using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetBalanceUpDayRequest : IRequest<BalanceUp>
{
}

public class GetBalanceUpDayHandler : IRequestHandler<GetBalanceUpDayRequest, BalanceUp>
{
    private readonly BalanceUpService balanceUpService;

    public GetBalanceUpDayHandler(BalanceUpService balanceUpService)
    {
        this.balanceUpService = balanceUpService;
    }

    public async Task<BalanceUp> Handle(GetBalanceUpDayRequest request, CancellationToken cancellationToken)
    {
        return await balanceUpService.GetBalanceUpDay();
    }
}