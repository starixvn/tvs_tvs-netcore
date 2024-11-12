using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class CheckNegativeBalanceRequest : CheckNegativeBetCreditCriteria, IRequest<IEnumerable<NegativeBalanceModel>>
{
}

public class CheckNegativeBalanceHandler(IDynamicRepository repository)
    : IRequestHandler<CheckNegativeBalanceRequest, IEnumerable<NegativeBalanceModel>>
{
    public async Task<IEnumerable<NegativeBalanceModel>> Handle(CheckNegativeBalanceRequest request, CancellationToken cancellationToken)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            request.SiteDbGroupId = server.Id;
            return repository.FetchAsync<NegativeBalanceModel>(request);
        });
        var results = await Task.WhenAll(tasks);

        return results.SelectMany(x => x);
    }
}