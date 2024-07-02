using System.Threading;
using System.Threading.Tasks;
using MediatR;
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

        return await betTypesRepository.GetGroupBetTypes(betTypesHaveTickets, request.MatchId, request.Mode);
    }
}