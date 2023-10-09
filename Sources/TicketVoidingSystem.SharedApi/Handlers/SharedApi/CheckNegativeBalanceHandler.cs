using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class CheckNegativeBalanceRequest : CheckNegativeBetCreditCriteria, IRequest<List<NegativeBalanceModel>>
{
}

public class CheckNegativeBalanceHandler : IRequestHandler<CheckNegativeBalanceRequest, List<NegativeBalanceModel>>
{
    private readonly IDynamicRepository repository;

    public CheckNegativeBalanceHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<List<NegativeBalanceModel>> Handle(CheckNegativeBalanceRequest request, CancellationToken cancellationToken)
    {
        var model = new List<NegativeBalanceModel>();
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            request.SiteDbGroupId = item.Id;
            var response = await repository.FetchAsync<NegativeBalanceModel>(request, cancellationToken);
            model.AddRange(response);
        }

        return model;
    }
}