using System.Text.Json;
using Fanex.Data.Repository;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface TicketsService
{
    Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2RacingService(IEnumerable<BetIdRecover> vs2RacingTickets, int siteDbGroupId);
}

public class GetTicketsServicesImp(IDynamicRepository repository) : TicketsService
{
    public async Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2RacingService(IEnumerable<BetIdRecover> vs2RacingTickets, int siteDbGroupId)
    {
        var criteria = new GetTicketsVs2RacingCriteria
        {
            TransIds = string.Join(",", vs2RacingTickets.Select(x => x.TransId)),
            SiteDbGroupId = siteDbGroupId
        };

        return await repository.FetchAsync<TicketsBetTransModel>(criteria);
    }

    public async Task<Result> UpdateTicketVs2RacingService(IEnumerable<TicketsBetTransModel> tickets, int siteDbGroupId)
    {
        var criteria = new UpdateTicketsVs2RacingCriteria
        {
            TransInfoJson = JsonSerializer.Serialize(tickets),
            SiteDbGroupId = siteDbGroupId
        };

        await repository.ExecuteAsync(criteria);

        return new Result
        {
            ErrorCode = criteria.ErrorCode,
            ErrorMsg = criteria.ErrorMsg
        };
    }
}