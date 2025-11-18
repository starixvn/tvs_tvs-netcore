using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface UpdateRemarkService
{
    Task<Result> Execute(AddRemarkQuery query);
}

public class UpdateRemarkServiceImp(IMapper mapper, SessionService sessionService, IDynamicRepository repository,
LoggingService loggingService)
    : UpdateRemarkService
{
    public async Task<Result> Execute(AddRemarkQuery query)
    {
        try
        {
            await ExecuteEditRemark(query);
            return new Result
            {
                ErrorCode = 0,
                ErrorMsg = "Success",
                Data = new AddRemarkResultData { MatchId = query.MatchId, RemarkId = query.RemarkId }
            };
        }
        catch (Exception exception)
        {
            _ = loggingService.ErrorAsync(exception);
            return new Result { ErrorCode = 1, ErrorMsg = exception.Message };
        }
    }

    private async Task ExecuteEditRemark(AddRemarkQuery query)
    {
        var command = mapper.Map<UpdateRemarkCommand>(query);
        command.Operators = query.OperatorsList?.OperatorToXml();
        command.UserId = sessionService.UserId;
        command.IP = sessionService.GetClientIp();

        await repository.ExecuteAsync(command);
    }
}