using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetOddsInfoRequest : IRequest<IEnumerable<OddsInfoViewModel>>
{
    public int MatchId { get; set; }

    public string BetTypes { get; set; }
}

public class GetOddsInfoHandler : IRequestHandler<GetOddsInfoRequest, IEnumerable<OddsInfoViewModel>>
{
    private readonly IDynamicRepository repository;

    public GetOddsInfoHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<OddsInfoViewModel>> Handle(GetOddsInfoRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetOddsInfoCriteria
        {
            MatchId = request.MatchId,
            BetTypes = request.BetTypes
        };
        return await repository.FetchAsync<OddsInfoViewModel>(criteria, cancellationToken);
    }
}