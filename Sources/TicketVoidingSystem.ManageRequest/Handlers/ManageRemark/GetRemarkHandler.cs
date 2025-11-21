using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class GetRemarkRequest : GetRemarkCriteria, IRequest<AddRemarkModel>;

public class GetRemarkHandler(GetRemarkService getRemarkService)
    : IRequestHandler<GetRemarkRequest, AddRemarkModel>
{
    public async Task<AddRemarkModel> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        return await getRemarkService.GetRemark(request.RemarkId);
    }
}

