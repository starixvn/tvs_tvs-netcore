using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLogInfoTicketsRequest : IRequest<TicketsViewModel>
{
    public string LogInfoTicketsJson { get; init; }

    public int IssueTypeId { get; set; }
}

public class GetLogInfoTicketsHandler : IRequestHandler<GetLogInfoTicketsRequest, TicketsViewModel>
{
    private readonly GetLogInfoTicketsService GetLogInfoTicketsService;

    public GetLogInfoTicketsHandler(GetLogInfoTicketsService GetLogInfoTicketsService)
    {
        this.GetLogInfoTicketsService = GetLogInfoTicketsService;
    }

    public async Task<TicketsViewModel> Handle(GetLogInfoTicketsRequest request, CancellationToken cancellationToken)
    {
        return GetLogInfoTicketsService.GetTicketsViewModel(request);
    }
}