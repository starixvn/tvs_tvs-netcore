using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class AddUsersRequest : AddUsersCommand, IRequest<Result>
{
}

public class AddUsersHandler(IDynamicRepository repository, SessionService session)
    : IRequestHandler<AddUsersRequest, Result>
{
    public async Task<Result> Handle(AddUsersRequest request, CancellationToken cancellationToken)
    {
        var criteria = new AddUsersCommand
        {
            Usernames = request.Usernames,
            UserId = session.UserId,
            SubTypes = request.SubTypes,
            VoidVIP = request.VoidVIP,
            IP = session.GetClientIp()
        };
        await repository.ExecuteAsync(criteria);

        return new Result();
    }
}