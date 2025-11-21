using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface DeleteRemarkService
{
    Task<Result> Execute(int remarkId);
}

public class DeleteRemarkServiceImp(SessionService sessionService, IDynamicRepository repository,
    LoggingService loggingService)
    : DeleteRemarkService
{
    public async Task<Result> Execute(int remarkId)
    {
        try
        {
            await ExecuteDeleteRemark(remarkId);
            return new Result
            {
                ErrorCode = 0,
                ErrorMsg = "Success"
            };
        }
        catch (Exception exception)
        {
            _ = loggingService.ErrorAsync(exception);
            return new Result { ErrorCode = 1, ErrorMsg = exception.Message };
        }
    }

    private async Task ExecuteDeleteRemark(int remarkId)
    {
        var command = new DeleteRemarkCommand
        {
            RemarkId = remarkId,
            UserId = sessionService.UserId,
            IP = sessionService.GetClientIp()
        };

        await repository.ExecuteAsync(command);
    }
}

