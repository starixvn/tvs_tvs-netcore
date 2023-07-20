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

public class NetPositionServiceImp : NetPositionService
{
    private readonly LoggingService loggingService;
    private readonly IDynamicRepository repository;

    public NetPositionServiceImp(LoggingService loggingService, IDynamicRepository repository)
    {
        this.loggingService = loggingService;
        this.repository = repository;
    }

    public async Task<bool> UpdateNetPosition(IEnumerable<BetId> transIds, string action)
    {
        if (!transIds.Any())
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
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var transIdsInServer = transIds.Where(x => x.SiteDbGroupId == server.Id).Select(x => x.TransId);
            if (transIdsInServer.Any())
            {
                var command = new TicketVoidingNetPositionCriteria
                {
                    StrTransIds = string.Join(",", transIdsInServer),
                    Action = action,
                    SiteDbGroupId = server.Id
                };

                yield return repository.ExecuteAsync(command);
            }
        }
    }

    public async Task RollBackNetPosition(IEnumerable<BetId> transIds)
    {
        if (transIds.Any())
        {
            await Task.WhenAll(RollBackNetPositionTasks(transIds));
        }
    }

    private IEnumerable<Task<int>> RollBackNetPositionTasks(IEnumerable<BetId> transIds)
    {
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var transIdsInServer = transIds.Where(x => x.SiteDbGroupId == server.Id).Select(x => x.TransId);
            if (transIdsInServer.Any())
            {
                var command = new TicketVoidingNetPositionCriteria
                {
                    StrTransIds = string.Join(",", transIdsInServer),
                    Action = NetPositionConstant.ActionRecover,
                    SiteDbGroupId = server.Id
                };

                yield return repository.ExecuteAsync(command);
            }
        }
    }
}