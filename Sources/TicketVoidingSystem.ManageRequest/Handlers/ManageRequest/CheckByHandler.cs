using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class CheckByRequest : IRequest<Result>
{
    public int RequestId { get; set; }

    public bool IsCheck { get; set; }
}

public class CheckByHandler : IRequestHandler<CheckByRequest, Result>
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public CheckByHandler(IDynamicRepository repository, SessionService sessionService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<Result> Handle(CheckByRequest request, CancellationToken cancellationToken)
    {
        var result = new Result();
        try
        {
            await UpdateRequest(request.RequestId, request.IsCheck);
        }
        catch (Exception exception)
        {
            result.ErrorCode = 1;
            result.ErrorMsg = exception.Message;
        }

        return await Task.FromResult(result);
    }

    private async Task UpdateRequest(int requestId, bool isCheck)
    {
        var command = new EditRequestCommand
        {
            RequestId = requestId,
            CheckedBy = isCheck ? sessionService.UserId : default(int?),
            UserId = sessionService.UserId,
            IP = sessionService.GetClientIp()
        };
        await repository.ExecuteAsync(command);
    }
}