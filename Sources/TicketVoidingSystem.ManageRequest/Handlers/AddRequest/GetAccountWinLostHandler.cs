using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

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
        //return await accountWinLostService.GetAccountWinLost(request);

        var x = new List<AccountWinlostModel>();

        for (var i = 1; i < 20; i++)
        {
            var y = new AccountWinlostModel
            {
                Username = "AAA",
                CustId = 1,
                GivenCredit = 200,
                AdjustVoidLimit = 0,
                CurrentWinning = 100,
                CurrentLosing = 50,
                EstimateVoidAmount = 20,
                WinLostAfterVoid = 10
            };
            var t = y;
            t.CustId += i;
            t.Username = $"{t.Username}{i}";
            t.GivenCredit += i;
            t.AdjustVoidLimit += i;
            t.CurrentWinning += i;
            t.CurrentLosing += i;
            t.EstimateVoidAmount += i;
            t.WinLostAfterVoid += i;
            t.IsHighlight = i % 2 > 0;
            x.Add(t);
        }

        return x;
    }
}