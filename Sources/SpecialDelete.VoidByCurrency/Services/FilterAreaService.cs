using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VoidByCurrency.Criteria;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByCurrency.Services;

public interface FilterAreaService
{
    Task<List<Currency>> GetCurrencies();

    Task<List<GroupLicensee>> GetLicensees();

    Task<string> GetRemark();
}

public class FilterAreaServiceImp : FilterAreaService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public FilterAreaServiceImp(
        IDynamicRepository repository,
        SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<List<Currency>> GetCurrencies()
    {
        var criteria = new GetCurrenciesCriteria();
        return (await repository.FetchAsync<Currency>(criteria)).ToList();
    }

    public async Task<List<GroupLicensee>> GetLicensees()
    {
        var criteria = new GetLicenseesCriteria();
        var licensees = await repository.FetchAsync<Licensee>(criteria);
        return licensees.GroupBy(b => b.GroupName)
            .Select(group => new GroupLicensee { GroupName = group.Key, Licensees = group.ToList() })
            .ToList();
    }

    public async Task<string> GetRemark()
    {
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host))
        {
            return "You can void \"Settled\" or \"Unsettled\" tickets.";
        }

        return await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host)
            ? "You can only void \"Unsettled\" tickets."
            : string.Empty;
    }
}