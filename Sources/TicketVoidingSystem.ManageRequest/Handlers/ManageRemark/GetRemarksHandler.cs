using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class GetRemarks : GetRemarksCriteria, IRequest<IEnumerable<RemarkModel>>;

public class GetRemarksHandler(IDynamicRepository repository)
    : IRequestHandler<GetRemarks, IEnumerable<RemarkModel>>
{
    public async Task<IEnumerable<RemarkModel>> Handle(GetRemarks request, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<RemarkModel>(request);
    }
}