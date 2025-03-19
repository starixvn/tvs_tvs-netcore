using System.Text.Json;
using Fanex.Data.Repository;
using Settlement.Business.Core.Constants;
using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface WinLimitService
{
    Task<IEnumerable<WinLimit>> GetMaxWinLimit(List<TicketsBetTransModel> tickets);
}

public class WinLimitServiceImp(
    CustomerService customerService,
    IDynamicRepository repository) : WinLimitService
{
    public async Task<IEnumerable<WinLimit>> GetMaxWinLimit(List<TicketsBetTransModel> tickets)
    {
        if (tickets.Count == 0 || tickets[0].SiteDBGroupId != SiteGroup.SiteDb3)
        {
            return [];
        }

        var listCustIds = customerService.GetCustomersByModds(tickets);
        var customersJson = JsonSerializer.Serialize(listCustIds);

        return await repository.FetchAsync<WinLimit>(new GetMaxPayoutSettingCriteria { ListCust = customersJson });
    }
}