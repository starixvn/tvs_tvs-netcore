using MediatR;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class GetSummaryRequest : GetSummaryQuery, IRequest<GetSummaryViewModel>;

public class GetSummaryHandler(GetSummaryTicketsService getSummaryTicketsService)
    : IRequestHandler<GetSummaryRequest, GetSummaryViewModel>
{
    public async Task<GetSummaryViewModel> Handle(GetSummaryRequest request, CancellationToken cancellationToken)
    {
        return await getSummaryTicketsService.GetSummaryTickets(request);
    }
}