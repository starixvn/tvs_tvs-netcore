using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Services.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface NotParticipateBetTypesService
{
    Task<IEnumerable<NotParticipateBetTypesModel>> GetBetTypes(int matchId);
}

public class NotParticipateBetTypesServiceImp : NotParticipateBetTypesService
{
    private readonly BetTypesRepository betTypesRepository;

    public NotParticipateBetTypesServiceImp(BetTypesRepository betTypesRepository)
    {
        this.betTypesRepository = betTypesRepository;
    }

    public async Task<IEnumerable<NotParticipateBetTypesModel>> GetBetTypes(int matchId)
    {
        var notParticipateBetTypes = new[] { 9650, 9651, 9652, 9653, 9654, 9655, 9656, 9657, 9658, 9659,
            9660, 9661, 9668, 9669, 9670, 9671, 9672, 9673, 9674, 9675 };
        var allBetTypesOfMatch = await betTypesRepository.GetBetTypesHaveTicketsForTvs(matchId);

        var results = notParticipateBetTypes
            .Where(betTypeId => allBetTypesOfMatch.Any(x => int.Parse(x.Id) == betTypeId))
            .Select(betTypeId =>
            {
                var x = allBetTypesOfMatch.FirstOrDefault(y => int.Parse(y.Id) == betTypeId);
                return new NotParticipateBetTypesModel
                {
                    BetTypeName = x?.Name,
                    BetTypeId = betTypeId
                };
            });

        return results;
    }
}