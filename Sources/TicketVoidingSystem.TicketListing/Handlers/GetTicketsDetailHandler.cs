using MediatR;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Handlers
{
    public class GetTicketsDetailRequest : GetTicketsDetailQuery, IRequest<TicketsViewModel>
    {
    }

    public class GetTicketsDetailHandler : IRequestHandler<GetTicketsDetailRequest, TicketsViewModel>
    {
        private readonly GetTicketsService getTicketsService;

        public GetTicketsDetailHandler(GetTicketsService getTicketsService)
        {
            this.getTicketsService = getTicketsService;
        }

        public async Task<TicketsViewModel> Handle(GetTicketsDetailRequest request, CancellationToken cancellationToken)
        {
            return await getTicketsService.GetTickets(request);
        }
    }
}