using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetLogInfoRequest : GetLogInfoQuery, IRequest<GetLogInfoViewModel>
{
}

public class GetLogInfoHandler : IRequestHandler<GetLogInfoRequest, GetLogInfoViewModel>
{
    private readonly LogInfoService logInfoService;

    public GetLogInfoHandler(LogInfoService logInfoService)
    {
        this.logInfoService = logInfoService;
    }

    public async Task<GetLogInfoViewModel> Handle(GetLogInfoRequest request, CancellationToken cancellationToken)
    {
        return await logInfoService.GetLogInfo(request);
    }
}