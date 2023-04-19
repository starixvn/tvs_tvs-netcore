using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;

namespace TicketVoidingSystem.Services.NetPosition;

public interface NetPositionService
{
    Task<bool> UpdateNetPosition(string transIds, string action);

    Task RollBackNetPosition(string transIds, string action, string message);
}

public class NetPositionServiceImp : NetPositionService
{
    private readonly NetPositionHttpClientService netPositionHttpClientService;
    private readonly SessionService sessionService;
    private readonly IDynamicRepository repository;

    public NetPositionServiceImp(
        NetPositionHttpClientService netPositionHttpClientService,
        SessionService sessionService,
        IDynamicRepository repository)
    {
        this.netPositionHttpClientService = netPositionHttpClientService;
        this.sessionService = sessionService;
        this.repository = repository;
    }

    public async Task<bool> UpdateNetPosition(string transIds, string action)
    {
        if (!string.IsNullOrEmpty(transIds))
        {
            var param = new UpdateNetPositionLogCriteria
            {
                AdminId = sessionService.UserId,
                ServiceType = ServiceApiType.Cricket,
                TransIds = transIds,
                Action = action
            };

            return await IsNetPosition(param);
        }

        return true;
    }

    private async Task<bool> IsNetPosition(UpdateNetPositionLogCriteria command)
    {
        command.StartTime = DateTime.Now;
        var result = await netPositionHttpClientService.PostRequest(command.TransIds, command.Action);
        command.EndTime = DateTime.Now;

        if (result.IsSuccessful)
        {
            command.ServiceStatus = ServiceApiStatus.Finished;
        }
        else
        {
            command.ServiceStatus = ServiceApiStatus.Failed;
            command.Reason = result.ErrorMsg;
        }

        await repository.ExecuteAsync(command);

        return result.IsSuccessful;
    }

    public async Task RollBackNetPosition(string transIds, string action, string message)
    {
        if (!string.IsNullOrWhiteSpace(transIds))
        {
            var command = new RollBackNetPositionCriteria
            {
                CricketIds = transIds,
                Action = action,
                AdminId = sessionService.UserId,
                Reason = message
            };
            await repository.ExecuteAsync(command);
        }
    }
}