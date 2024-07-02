using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesTvsRequest : BetTypeQueryModel, IRequest<GroupBetTypesViewModel>
{
}

public class GetGroupBetTypesTvsHandler : IRequestHandler<GetGroupBetTypesTvsRequest, GroupBetTypesViewModel>
{
    private readonly BetTypesRepository betTypesRepository;

    public GetGroupBetTypesTvsHandler(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

    public async Task<GroupBetTypesViewModel> Handle(GetGroupBetTypesTvsRequest request, CancellationToken cancellationToken)
    {
        var betTypesHaveTickets = await betTypesRepository.GetBetTypesHaveTicketsForTvs(request.MatchId, request.FromTransDate, request.ToTransDate);

        return new GroupBetTypesViewModel
        {
            GroupBetTypes = betTypesHaveTickets
                .DistinctBy(x => x.Id)
                .GroupBy(b => b.GroupName)
                .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
                .OrderBy(gr => gr.GroupName)
                .ToList()
        };
    }
}