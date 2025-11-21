using MediatR;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class GetRemarks : SelectRemarksQuery, IRequest<IEnumerable<RemarkModel>>;

public class GetRemarksHandler(GetRemarksService getRemarksService, RenderRemarkService renderRemarkService)
    : IRequestHandler<GetRemarks, IEnumerable<RemarkModel>>
{
    public async Task<IEnumerable<RemarkModel>> Handle(GetRemarks request, CancellationToken cancellationToken)
    {
        var remarks = await getRemarksService.GetRemarks(request);
        renderRemarkService.UpdateDescription(remarks);
        renderRemarkService.UpdateActionName(remarks);

        return remarks;
    }
}