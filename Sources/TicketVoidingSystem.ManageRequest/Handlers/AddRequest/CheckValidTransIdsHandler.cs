using MediatR;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidTransIdsRequest : CheckValidTransIdsModel, IRequest<CheckValidTransIdsViewModel>;

public class CheckValidTransIdsHandler(CheckValidTransIdsService checkValidTransIdsService)
    : IRequestHandler<CheckValidTransIdsRequest, CheckValidTransIdsViewModel>
{
    public async Task<CheckValidTransIdsViewModel> Handle(CheckValidTransIdsRequest request,
        CancellationToken cancellationToken)
    {
        return await checkValidTransIdsService.CheckValidTransIds(request);
    }
}