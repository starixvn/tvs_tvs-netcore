using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetBetTypesVirtualSportRequest : IRequest<GroupBetTypeVirtualSport>
{
    public byte Mode { get; set; }
    public int MatchId { get; set; }
}

public class GetBetTypesVirtualSportsHandler : IRequestHandler<GetBetTypesVirtualSportRequest, GroupBetTypeVirtualSport>
{
    private readonly BetTypesRepository betTypesRepository;

    public GetBetTypesVirtualSportsHandler(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

    public async Task<GroupBetTypeVirtualSport> Handle(GetBetTypesVirtualSportRequest message, CancellationToken cancellationToken)
    {
        var betTypesHaveTickets = string.Join(",", await betTypesRepository.GetBetTypesHaveTickets(new BetTypeQueryModel
        {
            Mode = message.Mode,
            MatchId = message.MatchId
        }));

        return await betTypesRepository.GetBetTypesTicketListingVirtualSport(message.MatchId, betTypesHaveTickets);
    }
}