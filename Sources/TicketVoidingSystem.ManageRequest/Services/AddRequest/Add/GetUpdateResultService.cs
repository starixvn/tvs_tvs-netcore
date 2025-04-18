using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface GetUpdateResultService
{
    Result? GetFirstError(IEnumerable<Result> results, string logStageName, IEnumerable<long> markedTickets);

    Result CreateSuccessResult(int requestId, string matchIdText, IEnumerable<long> markedTicketsSuccessful);

    Result CreateErrorResult(Exception exception, IEnumerable<long> markedTicketsSuccessful);
}

public class GetUpdateResultServiceImp : GetUpdateResultService
{
    public Result GetFirstError(IEnumerable<Result> results, string logStageName, IEnumerable<long> markedTickets)
    {
        var firstError = results.FirstOrDefault(x => !x.IsSuccessful);
        if (firstError == null)
        {
            return null;
        }

        return new Result
        {
            ErrorCode = firstError.ErrorCode,
            ErrorMsg = "Add request error!!!",
            Data = new AddRequestResultData
            {
                LogStageName = logStageName,
                LogResults = results,
                MarkedTicketsSuccessful = markedTickets
            }
        };
    }

    public Result CreateSuccessResult(int requestId, string matchIdText, IEnumerable<long> markedTicketsSuccessful)
    {
        return new Result
        {
            Data = new AddRequestResultData
            {
                RequestId = requestId,
                MatchId = matchIdText,
                MarkedTicketsSuccessful = markedTicketsSuccessful
            }
        };
    }

    public Result CreateErrorResult(Exception exception, IEnumerable<long> markedTicketsSuccessful)
    {
        return new Result
        {
            ErrorCode = 1,
            ErrorMsg = "Add request error!!!",
            Data = new AddRequestResultData
            {
                MarkedTicketsSuccessful = markedTicketsSuccessful
            }
        };
    }
}