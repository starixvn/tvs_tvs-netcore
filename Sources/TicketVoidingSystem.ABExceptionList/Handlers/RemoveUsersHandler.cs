using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.Core.Models;
using TicketVoidingSystem.Core.Services;

namespace TicketVoidingSystem.ABExceptionList.Handlers
{
    public class RemoveUsersRequest : RemoveUsersCommand, IRequest<Result>
    {
    }

    public class RemoveUsersHandler : IRequestHandler<RemoveUsersRequest, Result>
    {
        private readonly IDynamicRepository repository;
        private readonly SessionService session;

        public RemoveUsersHandler(IDynamicRepository repository, SessionService session)
        {
            this.repository = repository;
            this.session = session;
        }

        public async Task<Result> Handle(RemoveUsersRequest request, CancellationToken cancellationToken)
        {
            var command = new RemoveUsersCommand
            {
                CustIds = request.CustIds,
                UserId = session.UserId,
                IP = session.GetClientIp()
            };

            await repository.ExecuteAsync(command, cancellationToken);

            return new Result();
        }
    }
}