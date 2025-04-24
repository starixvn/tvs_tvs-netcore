using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface GetUpdateResultService
{
    Result? GetFirstError(IEnumerable<Result> results, string logStageName);

    Result CreateSuccessResult(int requestId, string matchIdText);

    Result CreateErrorResult(Exception exception);
}

public class GetUpdateResultServiceImp : GetUpdateResultService
{
    public Result GetFirstError(IEnumerable<Result> results, string logStageName)
    {
        var firstError = results.FirstOrDefault(x => !x.IsSuccessful);
        if (firstError == null)
        {
            return null;
        }

        return new Result
        {
            ErrorCode = firstError.ErrorCode,
            ErrorMsg = firstError.ErrorMsg,
            Data = new AddRequestResultData
            {
                LogStageName = logStageName,
                LogResults = results
            }
        };
    }

    public Result CreateSuccessResult(int requestId, string matchIdText)
    {
        return new Result
        {
            Data = new AddRequestResultData
            {
                RequestId = requestId,
                MatchId = matchIdText
            }
        };
    }

    public Result CreateErrorResult(Exception exception)
    {
        return new Result
        {
            ErrorCode = 1,
            ErrorMsg = exception.Message
        };
    }
}