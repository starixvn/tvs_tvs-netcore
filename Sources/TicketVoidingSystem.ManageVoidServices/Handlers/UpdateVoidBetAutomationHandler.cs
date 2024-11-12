using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateVoidBetAutomationInfoRequest : VoidBetAutomationModel, IRequest<bool>
{
}

public class UpdateVoidBetAutomationHandler(AfterVoidService afterVoidService, LoggingService loggingService)
    : IRequestHandler<UpdateVoidBetAutomationInfoRequest, bool>
{
    public async Task<bool> Handle(UpdateVoidBetAutomationInfoRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await afterVoidService.UpdateVoidBetAutomationServiceInfo(request);
            return true;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(nameof(AfterVoidService.UpdateVoidBetAutomationServiceInfo), e);
            return false;
        }
    }
}