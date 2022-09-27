using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Logging;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers
{
    public class UpdateVoidBetAutomationInfoRequest : VoidBetAutomationModel, IRequest<bool>
    {
    }

    public class UpdateVoidBetAutomationHandler : IRequestHandler<UpdateVoidBetAutomationInfoRequest, bool>
    {
        private readonly AfterVoidService afterVoidService;

        public UpdateVoidBetAutomationHandler(AfterVoidService afterVoidService)
        {
            this.afterVoidService = afterVoidService;
        }

        public async Task<bool> Handle(UpdateVoidBetAutomationInfoRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await afterVoidService.UpdateVoidBetAutomationServiceInfo(request);
                return true;
            }
            catch (Exception e)
            {
                await LogService.ErrorAsync(nameof(AfterVoidService.UpdateVoidBetAutomationServiceInfo), e);
                return false;
            }
        }
    }
}