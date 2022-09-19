using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageVoidServices.Handlers;

namespace TicketVoidingSystem.ManageVoidServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ManageVoidServicesController : ControllerBase
    {
        private readonly IMediator mediator;

        public ManageVoidServicesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> GetVoidBetAutomationServiceInfo(GetVoidBetAutomationInfoRequest request)
        {
            var model = await mediator.Send(request);
            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateVoidBetAutomationServiceInfo(UpdateVoidBetAutomationInfoRequest request)
        {
            var model = await mediator.Send(request);
            return Ok(model);
        }
    }
}