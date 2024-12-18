using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class RemoveUsersRequest : RemoveUsersCommand, IRequest<Result>;

public class RemoveUsersHandler(IDynamicRepository repository, SessionService session)
    : IRequestHandler<RemoveUsersRequest, Result>
{
    public async Task<Result> Handle(RemoveUsersRequest request, CancellationToken cancellationToken)
    {
        var command = new RemoveUsersCommand
        {
            CustIds = request.CustIds,
            UserId = session.UserId,
            IP = session.GetClientIp()
        };

        await repository.ExecuteAsync(command);

        return new Result();
    }
}