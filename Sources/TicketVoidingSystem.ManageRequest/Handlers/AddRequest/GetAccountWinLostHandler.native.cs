using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetAccountWinLostRequest : GetAccountWinLostQuery, IRequest<IEnumerable<AccountWinlostModel>>
{
}

public class GetAccountWinLostHandler : IRequestHandler<GetAccountWinLostRequest, IEnumerable<AccountWinlostModel>>
{
    private readonly AccountWinLostService accountWinLostService;

    public GetAccountWinLostHandler(AccountWinLostService accountWinLostService)
    {
        this.accountWinLostService = accountWinLostService;
    }

    public async Task<IEnumerable<AccountWinlostModel>> Handle(GetAccountWinLostRequest request, CancellationToken cancellationToken)
    {
        return await accountWinLostService.GetAccountWinLost(request);
    }
}