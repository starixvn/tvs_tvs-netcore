using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class GetVoidBetAutomationInfoRequest : VoidBetAutomationModel, IRequest<VoidBetAutomationModel>
{
}

public class GetVoidBetAutomationInfoHandler : IRequestHandler<GetVoidBetAutomationInfoRequest, VoidBetAutomationModel>
{
    private readonly AfterVoidService afterVoidService;

    public GetVoidBetAutomationInfoHandler(AfterVoidService afterVoidService)
    {
        this.afterVoidService = afterVoidService;
    }

    public async Task<VoidBetAutomationModel> Handle(GetVoidBetAutomationInfoRequest request, CancellationToken cancellationToken)
    {
        return await afterVoidService.GetVoidBetAutomationServiceInfo(request);
    }
}