using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Services.SharedApi;

public interface BalanceUpService
{
    Task<BalanceUp> GetBalanceUpDay();

    Task<BalanceUp> GetBalanceUpDayZoneManila();
}

public class BalanceUpServiceImp(IDynamicRepository repository) : BalanceUpService
{
    public async Task<BalanceUp> GetBalanceUpDay()
    {
        var criteria = new GetBalanceUpDayCriteria();

        return await repository.GetAsync<BalanceUp>(criteria);
    }

    public async Task<BalanceUp> GetBalanceUpDayZoneManila()
    {
        var buDay = await GetBalanceUpDay();

        return new BalanceUp
        {
            BalanceUpDay = buDay.BalanceUpDay.ZoneManila(),
            MoveBetsDay = buDay.MoveBetsDay.ZoneManila()
        };
    }
}