using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Analytics;

namespace TicketVoidingSystem.SharedApi.Services.Analytics;

public interface UserActionLogService
{
    Task<bool> LogAccessFunction(string functionName);

    Task<bool> LogChangeContent(string functionName, string logContent);
}

public class UserActionLogServiceImp(
    SessionService sessionService,
    IDynamicRepository repository,
    LoggingService loggingService)
    : UserActionLogService
{
    public async Task<bool> LogAccessFunction(string functionName)
    {
        try
        {
            var criteria = new UserActionLogUpdateCriteria
            {
                IsActionCount = true,
                UserId = sessionService.UserId,
                FunctionName = functionName
            };

            await repository.ExecuteAsync(criteria);
            return true;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(nameof(LogAccessFunction), e);
            return false;
        }
    }

    public async Task<bool> LogChangeContent(string functionName, string logContent)
    {
        try
        {
            var criteria = new UserActionLogUpdateCriteria
            {
                IsActionCount = false,
                UserId = sessionService.UserId,
                FunctionName = functionName,
                LogContent = logContent
            };
            await repository.ExecuteAsync(criteria);
            return true;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(nameof(LogChangeContent), e);
            return false;
        }
    }
}