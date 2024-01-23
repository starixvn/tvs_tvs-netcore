using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SimpleDataApi.Criteria;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SimpleDataApi.Services;

public interface TicketsCheckPermissionService
{
    IEnumerable<string> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel);
}

public class TicketsCheckPermissionServiceImp : TicketsCheckPermissionService
{
    private readonly IDynamicRepository repository;

    public TicketsCheckPermissionServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    private static (IEnumerable<BetId>, IEnumerable<BetId>) GetTicketForCheckPermission(Dictionary<string, object> queryModel)
    {
        var tickets = Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetId>>(queryModel["tickets"].ToString());
        IEnumerable<BetId> cancelCashOutTickets = new List<BetId>();
        if (queryModel.TryGetValue("cancelCashOutTickets", out var value))
        {
            cancelCashOutTickets = Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetId>>(value.ToString());
        }

        return (tickets, cancelCashOutTickets);
    }

    public IEnumerable<string> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel)
    {
        var (tickets, cancelCashOutTickets) = GetTicketForCheckPermission(queryModel);
        var transInfoJsonList = new List<string>();
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var cancelCashOutTicketsInSiteDb = cancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
            if (!ticketsInSiteDb.Any() && !cancelCashOutTicketsInSiteDb.Any())
            {
                continue;
            }

            var criteria = new GetTransInfoForCheckPermissionCriteria
            {
                SiteDbGroupId = siteDbGroupId,
                TransIds = Helper.JoinBetIdList(ticketsInSiteDb),
                CancelCashOutTransIds = Helper.JoinBetIdList(cancelCashOutTicketsInSiteDb)
            };
            var response = repository.Get<string>(criteria);
            transInfoJsonList.Add(response);
        }

        return transInfoJsonList;
    }
}