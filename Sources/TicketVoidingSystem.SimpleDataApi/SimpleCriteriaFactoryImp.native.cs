using Fanex.Data.Repository;
using Fanex.NAP.Core.Business;
using Olympus.SimpleDataApi;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SimpleDataApi.Criteria;
using TicketVoidingSystem.SimpleDataApi.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SimpleDataApi;

public class SimpleCriteriaFactoryImp : SimpleCriteriaFactoryBase
{
    private readonly SessionService sessionService;
    private readonly TicketsCheckPermissionService ticketsCheckPermissionService;

    static SimpleCriteriaFactoryImp()
    {
        CommandTypes.Add("void-by-bet-id-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidByBetIdCriteria));
        CommandTypes.Add("void-single-bet-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidSingleBetCriteria));
        CommandTypes.Add("void-early-kick-off-bet-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidEarlyKickOffCriteria));
        CommandTypes.Add("void-parlay-bet-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidParlayBetCriteria));
        CommandTypes.Add("void-by-currency-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidByCurrencyCriteria));
        CommandTypes.Add("void-cash-out-check-void-bet-permission", typeof(CheckVoidBetPermissionVoidCashOutTransactionCriteria));
        CommandTypes.Add("ticket-voiding-check-void-bet-permission", typeof(CheckVoidBetPermissionTicketVoidingCriteria));
        CommandTypes.Add("mark-tickets-check-permission", typeof(CheckPermissionMarkTicketsCriteria));
    }

    public SimpleCriteriaFactoryImp(SessionService sessionService, TicketsCheckPermissionService ticketsCheckPermissionService)
    {
        this.sessionService = sessionService;
        this.ticketsCheckPermissionService = ticketsCheckPermissionService;
    }

    public override INonQueryCommand CreateNonQueryCommand(Type commandType, Dictionary<string, object> queryModel)
    {
        if (commandType == typeof(CheckVoidBetPermissionVoidByBetIdCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionVoidSingleBetCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidInstantlySettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionVoidEarlyKickOffCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidEarlyKickOffBet, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionVoidParlayBetCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledParlayBet, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledParlayBet, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionVoidByCurrencyCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionVoidCashOutTransactionCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckVoidBetPermissionTicketVoidingCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidSettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidInstantlySettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host));
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host));

            return base.CreateNonQueryCommand(commandType, queryModel);
        }

        if (commandType == typeof(CheckPermissionMarkTicketsCriteria))
        {
            AddTransInfoJson(queryModel);
            queryModel.SafeAdd("IsHostVoidUnsettledTickets", sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host));
        }

        return base.CreateNonQueryCommand(commandType, queryModel);
    }

    private void AddTransInfoJson(Dictionary<string, object> queryModel)
    {
        var transInfoJsonList = ticketsCheckPermissionService.GetTransInfoForCheckPermission(queryModel);
        queryModel.SafeAdd("TransInfoJson", string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x))));
    }
}