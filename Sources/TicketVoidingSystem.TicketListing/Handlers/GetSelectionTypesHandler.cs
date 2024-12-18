using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class GetSelectionTypesRequest : GetSelectionTypesCriteria, IRequest<IEnumerable<SelectionTypeModel>>;

public class GetSelectionTypesHandler(IDynamicRepository repository)
    : IRequestHandler<GetSelectionTypesRequest, IEnumerable<SelectionTypeModel>>
{
    public async Task<IEnumerable<SelectionTypeModel>> Handle(GetSelectionTypesRequest message, CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<SelectionTypeModel>(message);
    }
}