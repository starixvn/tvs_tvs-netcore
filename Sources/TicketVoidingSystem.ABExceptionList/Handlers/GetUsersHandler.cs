using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.ABExceptionList.Services;

namespace TicketVoidingSystem.ABExceptionList.Handlers;

public class GetUsersRequest : GetUsersCriteria, IRequest<UserViewModel>
{
}

public class GetUsersHandler : IRequestHandler<GetUsersRequest, UserViewModel>
{
    private readonly GetUsersService getUsersService;

    public GetUsersHandler(GetUsersService getUsersService)
    {
        this.getUsersService = getUsersService;
    }

    public async Task<UserViewModel> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        var viewModel = new UserViewModel
        {
            Users = await getUsersService.GetUsers(request),
            InvalidUsername = request.InvalidUsername
        };

        return viewModel;
    }
}