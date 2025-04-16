using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLogInfoTicketsRequest : IRequest<TicketsViewModel>
{
    public string LogInfoTicketsJson { get; init; }
    public int IssueTypeId { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

public class GetLogInfoTicketsHandler(GetLogInfoTicketsService getLogInfoTicketsService)
    : IRequestHandler<GetLogInfoTicketsRequest, TicketsViewModel>
{
    public Task<TicketsViewModel> Handle(GetLogInfoTicketsRequest request, CancellationToken cancellationToken)
    {
        return Task.FromResult(getLogInfoTicketsService.GetTicketsViewModel(request));
    }
}