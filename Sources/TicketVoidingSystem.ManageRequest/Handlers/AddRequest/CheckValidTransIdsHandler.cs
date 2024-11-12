using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidTransIdsRequest : CheckValidTransIdsModel, IRequest<CheckValidTransIdsViewModel>
{
}

public class CheckValidTransIdsHandler(CheckValidTransIdsService checkValidTransIdsService)
    : IRequestHandler<CheckValidTransIdsRequest, CheckValidTransIdsViewModel>
{
    public async Task<CheckValidTransIdsViewModel> Handle(CheckValidTransIdsRequest request,
        CancellationToken cancellationToken)
    {
        return await checkValidTransIdsService.CheckValidTransIds(request);
    }
}