using Fanex.NAP.Client.Helpers.Business;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByCurrency.Services;

public interface FilterAreaService
{
    Task<string> GetRemark();
}

public class FilterAreaServiceImp(SessionService sessionService) : FilterAreaService
{
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