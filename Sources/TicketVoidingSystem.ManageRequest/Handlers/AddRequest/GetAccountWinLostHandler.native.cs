using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetAccountWinLostRequest : GetAccountWinLostQuery, IRequest<IEnumerable<AccountWinlostModel>>
{
}

public class GetAccountWinLostHandler(AccountWinLostService accountWinLostService)
    : IRequestHandler<GetAccountWinLostRequest, IEnumerable<AccountWinlostModel>>
{
    public async Task<IEnumerable<AccountWinlostModel>> Handle(GetAccountWinLostRequest request, CancellationToken cancellationToken)
    {
        return await accountWinLostService.GetAccountWinLost(request);
    }
}