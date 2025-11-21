using MediatR;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class DeleteRemark : IRequest<Result>
{
    public int RemarkId { get; set; }
}

public class DeleteRemarkHandler(DeleteRemarkService deleteRemarkService)
    : IRequestHandler<DeleteRemark, Result>
{
    public async Task<Result> Handle(DeleteRemark request, CancellationToken cancellationToken)
    {
        return await deleteRemarkService.Execute(request.RemarkId);
    }
}

