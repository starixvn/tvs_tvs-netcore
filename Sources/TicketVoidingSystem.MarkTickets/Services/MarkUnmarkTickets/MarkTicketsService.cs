using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;

public interface MarkTicketsService
{
    Task<Result> Execute(MarkTicketsQuery query);
}

public class MarkTicketsServiceImp : MarkTicketsService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService session;

    public MarkTicketsServiceImp(IDynamicRepository repository, SessionService session)
    {
        this.repository = repository;
        this.session = session;
    }

    public async Task<Result> Execute(MarkTicketsQuery query)
    {
        var resultInAllServers = new List<Result>();
        var criteria = new MarkTicketsCommand
        {
            Status = query.Status,
            UserId = session.UserId,
            Ip = session.GetClientIp(),
            LogActionId = query.Status == 0 ? 90500 : 90501
        };

        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var results = await ExecuteByServerId(criteria, query, server.Id);
            resultInAllServers.AddRange(results);
        }

        var firstErrorResult = resultInAllServers.FirstOrDefault(x => !x.IsSuccessful);
        var combineResult = new Result
        {
            ErrorCode = firstErrorResult?.ErrorCode ?? 0,
            ErrorMsg = firstErrorResult?.ErrorMsg ?? string.Empty
        };
        return combineResult;
    }

    private async Task<IEnumerable<Result>> ExecuteByServerId(MarkTicketsCommand criteria, MarkTicketsQuery query, int siteDbGroupId)
    {
        var ticketsInServer = query.Tickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
        if (!ticketsInServer.Any())
        {
            return Enumerable.Empty<Result>();
        }

        criteria.SiteDbGroupId = siteDbGroupId;
        criteria.TransIds = Helper.JoinBetIdList(ticketsInServer);
        var results = await repository.FetchAsync<Result>(criteria);
        return results;
    }
}