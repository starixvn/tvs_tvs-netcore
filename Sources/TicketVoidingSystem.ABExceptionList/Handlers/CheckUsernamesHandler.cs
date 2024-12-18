using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class CheckUsernamesRequest : CheckUsernamesCriteria, IRequest<CheckUsernamesModel>;

public class CheckUsernamesHandler(IDynamicRepository repository)
    : IRequestHandler<CheckUsernamesRequest, CheckUsernamesModel>
{
    public async Task<CheckUsernamesModel> Handle(CheckUsernamesRequest request, CancellationToken cancellationToken)
    {
        return await repository.GetAsync<CheckUsernamesModel>(request);
    }
}