using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLogInfoRequest : GetLogInfoQuery, IRequest<GetLogInfoViewModel>;

public class GetLogInfoHandler(LogInfoService logInfoService) : IRequestHandler<GetLogInfoRequest, GetLogInfoViewModel>
{
    public async Task<GetLogInfoViewModel> Handle(GetLogInfoRequest request, CancellationToken cancellationToken)
    {
        return await logInfoService.Get(request);
    }
}