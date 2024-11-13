using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetBalanceUpDayRequest : IRequest<BalanceUp>;

public class GetBalanceUpDayHandler(BalanceUpService balanceUpService)
    : IRequestHandler<GetBalanceUpDayRequest, BalanceUp>
{
    public async Task<BalanceUp> Handle(GetBalanceUpDayRequest request, CancellationToken cancellationToken)
    {
        return await balanceUpService.GetBalanceUpDay();
    }
}