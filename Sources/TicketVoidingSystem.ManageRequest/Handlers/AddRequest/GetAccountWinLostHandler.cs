using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetAccountWinLostRequest : GetAccountWinLostCriteria, IRequest<IEnumerable<AccountWinlostModel>>
{
}

public class GetAccountWinLostHandler : IRequestHandler<GetAccountWinLostRequest, IEnumerable<AccountWinlostModel>>
{
    private readonly IDynamicRepository repository;

    public GetAccountWinLostHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<AccountWinlostModel>> Handle(GetAccountWinLostRequest request, CancellationToken cancellationToken)
    {
        //return await repository.FetchAsync<AccountWinlostModel>(request, cancellationToken);
        return new List<AccountWinlostModel>
        {
            new()
            {
                Username = "AAA", CustId = 1, GivenCredit = 200, AdjustVoidLimit = 0, CurrentWinning = 100, CurrentLosing = 50,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "BBB", CustId = 2, GivenCredit = 200, AdjustVoidLimit = 0, CurrentWinning = 100, CurrentLosing = 300,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "CCC", CustId = 3, GivenCredit = 200, AdjustVoidLimit = 0, CurrentWinning = 100, CurrentLosing = 50,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "DD", CustId = 4, GivenCredit = 200, AdjustVoidLimit = 0, CurrentWinning = 100, CurrentLosing = 300,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "EE", CustId = 5, GivenCredit = 200, AdjustVoidLimit = 0, CurrentWinning = 100, CurrentLosing = 300,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            }
        };
    }
}