using System.Threading;
using System.Threading.Tasks;
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
            catch
            {
                return false;
            }
        }
    }
}