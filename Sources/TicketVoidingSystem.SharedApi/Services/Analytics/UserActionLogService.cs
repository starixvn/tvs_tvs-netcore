using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Analytics;

namespace TicketVoidingSystem.SharedApi.Services.Analytics;

public interface UserActionLogService
{
    bool LogAccessFunction(string functionName);

    void LogChangeContent(string functionName, string logContent);
}

public class UserActionLogServiceImp(
    SessionService sessionService,
    IDynamicRepository repository)
    : UserActionLogService
{
    public bool LogAccessFunction(string functionName)
    {
        Task.Run(async () =>
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
            }
            catch
            {
                // Silently ignore any errors in background logging
            }
        });

        return true;
    }

    public void LogChangeContent(string functionName, string logContent)
    {
        Task.Run(async () =>
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
            }
            catch
            {
                // Silently ignore any errors in background logging
            }
        });
    }
}