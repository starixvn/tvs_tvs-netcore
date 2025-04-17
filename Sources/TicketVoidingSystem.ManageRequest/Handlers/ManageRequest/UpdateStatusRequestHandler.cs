using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class UpdateStatusRequest : UpdateStatusRequestCommand, IRequest<Result>;

public class UpdateStatusRequestHandler(IDynamicRepository repository)
    : IRequestHandler<UpdateStatusRequest, Result>
{
    public async Task<Result> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await repository.ExecuteAsync(request);
            return new Result();
        }
        catch (Exception exception)
        {
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message
            };
        }
    }
}