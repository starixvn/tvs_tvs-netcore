using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLiveGameEarlyTicketsRequest : IRequest<TicketsViewModel>
{
    public string LiveGameEarlyTicketsJson { get; init; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public int issueTypeId { get; set; }
}

public class GetLiveGameEarlyTicketsHandler : IRequestHandler<GetLiveGameEarlyTicketsRequest, TicketsViewModel>
{
    private readonly GetLiveGameEarlyTicketService getLiveGameEarlyTicketService;

    public GetLiveGameEarlyTicketsHandler(GetLiveGameEarlyTicketService getLiveGameEarlyTicketService)
    {
        this.getLiveGameEarlyTicketService = getLiveGameEarlyTicketService;
    }

    public async Task<TicketsViewModel> Handle(GetLiveGameEarlyTicketsRequest request, CancellationToken cancellationToken)
    {
        return getLiveGameEarlyTicketService.GetTicketsViewModel(request);
    }
}