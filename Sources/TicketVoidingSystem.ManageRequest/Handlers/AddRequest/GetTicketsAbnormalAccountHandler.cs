using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetTicketsAbnormalAccountRequest : IRequest<TicketsViewModel>
{
    public int CustId { get; set; }

    public string TransInfoJson { get; set; }
}

public class GetTicketsAbnormalAccountHandler(GetTicketsService getTicketService) : IRequestHandler<GetTicketsAbnormalAccountRequest, TicketsViewModel>
{
    public async Task<TicketsViewModel> Handle(GetTicketsAbnormalAccountRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(getTicketService.Get(request.CustId, request.TransInfoJson));
    }
}