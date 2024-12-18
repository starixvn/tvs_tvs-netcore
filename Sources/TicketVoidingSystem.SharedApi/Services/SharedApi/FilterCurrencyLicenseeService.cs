using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Services.SharedApi;

public interface FilterCurrencyLicenseeService
{
    Task<IEnumerable<Currency>> GetCurrencies();

    Task<IEnumerable<GroupLicensee>> GetGroupLicensees();
}

public class FilterCurrencyLicenseeServiceImp(IDynamicRepository repository) : FilterCurrencyLicenseeService
{
    public async Task<IEnumerable<Currency>> GetCurrencies()
    {
        var criteria = new GetCurrenciesCriteria();
        return await repository.FetchAsync<Currency>(criteria);
    }

    public async Task<IEnumerable<GroupLicensee>> GetGroupLicensees()
    {
        var criteria = new GetLicenseesCriteria();
        var licensees = await repository.FetchAsync<Licensee>(criteria);

        return licensees.GroupBy(b => b.GroupName)
                .Select(group => new GroupLicensee { GroupName = group.Key, Licensees = group.ToList() });
    }
}