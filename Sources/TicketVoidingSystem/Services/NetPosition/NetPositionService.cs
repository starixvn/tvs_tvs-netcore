using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.NetPosition;

public interface NetPositionService
{
    Task<bool> UpdateNetPosition(IEnumerable<BetId> transIds, string action);

    Task RollBackNetPosition(IEnumerable<BetId> transIds);
}

public class NetPositionServiceImp(LoggingService loggingService, IDynamicRepository repository)
    : NetPositionService
{
    public async Task<bool> UpdateNetPosition(IEnumerable<BetId> transIds, string action)
    {
        if (transIds == null || !transIds.Any())
        {
            return true;
        }

        try
        {
            await Task.WhenAll(UpdateNetPositionTasks(transIds, action));
            return true;
        }
        catch (Exception ex)
        {
            await loggingService.ErrorAsync(ex);
            return false;
        }
    }

    private IEnumerable<Task<int>> UpdateNetPositionTasks(IEnumerable<BetId> transIds, string action)
    {
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            var transIdsInServer = transIds.Where(x => x.SiteDbGroupId == siteDbGroupId).Select(x => x.TransId);
            if (!transIdsInServer.Any())
            {
                continue;
            }

            var command = new TicketVoidingNetPositionCriteria
            {
                StrTransIds = string.Join(",", transIdsInServer),
                Action = action,
                SiteDbGroupId = siteDbGroupId
            };

            yield return repository.ExecuteAsync(command);
        }
    }

    public async Task RollBackNetPosition(IEnumerable<BetId> transIds)
    {
        if (transIds != null && transIds.Any())
        {
            await Task.WhenAll(RollBackNetPositionTasks(transIds));
        }
    }

    private IEnumerable<Task<int>> RollBackNetPositionTasks(IEnumerable<BetId> transIds)
    {
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(x => x.Id))
        {
            var transIdsInServer = transIds.Where(x => x.SiteDbGroupId == siteDbGroupId).Select(x => x.TransId);
            if (!transIdsInServer.Any())
            {
                continue;
            }

            var command = new TicketVoidingNetPositionCriteria
            {
                StrTransIds = string.Join(",", transIdsInServer),
                Action = NetPositionConstant.ActionRecover,
                SiteDbGroupId = siteDbGroupId
            };

            yield return repository.ExecuteAsync(command);
        }
    }
}