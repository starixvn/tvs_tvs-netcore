using MediatR;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class UpdateRemark : AddRemarkQuery, IRequest<Result>;

public class UpdateRemarkHandler(UpdateRemarkService updateRemarkService)
    : IRequestHandler<UpdateRemark, Result>
{
    public async Task<Result> Handle(UpdateRemark request, CancellationToken cancellationToken)
    {
        return await updateRemarkService.Execute(request);
    }
}