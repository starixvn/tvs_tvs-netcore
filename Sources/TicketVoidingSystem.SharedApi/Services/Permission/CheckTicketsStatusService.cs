using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.Permission;

public interface CheckTicketsStatusService
{
    Task<string> GetTransInfoJsonForCheckPermission(CheckTicketsStatusRequest request);
}

public class CheckTicketsStatusServiceImp(IDynamicRepository repository) : CheckTicketsStatusService
{
    public async Task<string> GetTransInfoJsonForCheckPermission(CheckTicketsStatusRequest request)
    {
        var tickets = request.Tickets ?? new List<BetId>();
        var cancelCashOutTickets = request.CancelCashOutTickets ?? new List<BetId>();
        var criteria = new GetTransInfoForCheckVoidPermissionCriteria();
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            var cancelCashOutTicketsInSiteDb = cancelCashOutTickets.Where(x => x.SiteDbGroupId == server.Id);
            if (ticketsInSiteDb.Any() || cancelCashOutTicketsInSiteDb.Any())
            {
                criteria.SiteDbGroupId = server.Id;
                criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
                criteria.CancelCashOutTransIds = Helper.JoinBetIdList(cancelCashOutTicketsInSiteDb);
                return repository.GetAsync<string>(criteria);
            }

            return Task.FromResult(string.Empty);
        });

        var transInfoJsonList = await Task.WhenAll(tasks);
        return string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));
    }
}