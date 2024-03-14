using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetGroupBetTypesRequest : BetTypeQueryModel, IRequest<GroupBetTypesViewModel>
{
}

public class GetGroupBetTypesHandler : IRequestHandler<GetGroupBetTypesRequest, GroupBetTypesViewModel>
{
    private readonly BetTypesRepository betTypesRepository;

    public GetGroupBetTypesHandler(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

    public async Task<GroupBetTypesViewModel> Handle(GetGroupBetTypesRequest request, CancellationToken cancellationToken)
    {
        var betTypesHaveTickets = string.IsNullOrEmpty(request.BetTypes)
            ? string.Join(",", await betTypesRepository.GetBetTypesHaveTickets(request))
            : request.BetTypes;

        var criteria = new GetBetTypesCriteria
        {
            MatchId = request.MatchId,
            Mode = request.Mode,
            BetTypes = betTypesHaveTickets
        };

        var betTypes = await betTypesRepository.GetBetTypes(criteria);

        return new GroupBetTypesViewModel
        {
            Result = betTypes.Result,
            GroupBetTypes = betTypes.Result.IsSuccessful ? betTypes.BetTypes
                    .GroupBy(b => b.GroupName)
                    .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
                    .OrderBy(gr => gr.GroupName)
                    .ToList()
                : new List<GroupBetTypeModel>()
        };
    }
}