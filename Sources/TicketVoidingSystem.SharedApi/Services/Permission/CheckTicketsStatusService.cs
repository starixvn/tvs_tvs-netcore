using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Services.Permission;

public interface CheckTicketsStatusService
{
    Task<string> GetTransInfoJsonForCheckPermission(CheckTicketsStatusRequest request);
}

public class CheckTicketsStatusServiceImp(IDynamicRepository repository, OnlineServerRepository onlineServerRepository) : CheckTicketsStatusService
{
    public async Task<string> GetTransInfoJsonForCheckPermission(CheckTicketsStatusRequest request)
    {
        var currentOnlineServers = await onlineServerRepository.GetOnlineServerIdsModel();
        var tickets = request.Tickets ?? new List<BetId>();
        var cancelCashOutTickets = request.CancelCashOutTickets ?? new List<BetId>();
        var criteria = new GetTransInfoForCheckVoidPermissionCriteria
        {
            OnlineServerId = string.Join(",", currentOnlineServers.Select(x => x.Id))
        };
        var ticketsServerDown = tickets.Where(x => !currentOnlineServers.Select(t => t.Id).Contains(x.SiteDbGroupId));
        var tasks = currentOnlineServers.Select(server =>
        {
            var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
            var cancelCashOutTicketsInSiteDb = cancelCashOutTickets.Where(x => x.SiteDbGroupId == server.Id);
            if ((server.Id is SiteDbGroupConstant.CentralDb && ticketsServerDown.Any())
                || ticketsInSiteDb.Any()
                || cancelCashOutTicketsInSiteDb.Any())
            {
                criteria.SiteDbGroupId = server.Id;
                criteria.TransIds = GetTransIds(ticketsServerDown, ticketsInSiteDb, server.Id);
                criteria.CancelCashOutTransIds = Helper.JoinBetIdList(cancelCashOutTicketsInSiteDb);

                return repository.GetAsync<string>(criteria);
            }

            return Task.FromResult(string.Empty);
        });

        var transInfoJsonList = await Task.WhenAll(tasks);
        return string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));
    }

    private static string GetTransIds(IEnumerable<BetId> ticketsServerDown, IEnumerable<BetId> ticketsInSiteDb, int currentServerId)
    {
        return currentServerId is SiteDbGroupConstant.CentralDb && ticketsServerDown.Any()
            ? Helper.JoinBetIdList([.. ticketsServerDown, .. ticketsInSiteDb])
            : Helper.JoinBetIdList([.. ticketsInSiteDb]);
    }
}