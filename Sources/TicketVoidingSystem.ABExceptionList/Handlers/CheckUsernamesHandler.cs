using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;

namespace TicketVoidingSystem.ABExceptionList.Handlers
{
    public class CheckUsernamesRequest : CheckUsernamesCriteria, IRequest<CheckUsernamesModel>
    {
    }

    public class CheckUsernamesHandler : IRequestHandler<CheckUsernamesRequest, CheckUsernamesModel>
    {
        private readonly IDynamicRepository repository;

        public CheckUsernamesHandler(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<CheckUsernamesModel> Handle(CheckUsernamesRequest request, CancellationToken cancellationToken)
        {
            return await repository.GetAsync<CheckUsernamesModel>(request, cancellationToken);
        }
    }
}