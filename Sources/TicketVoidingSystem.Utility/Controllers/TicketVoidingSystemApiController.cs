using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Utility.Handlers;

namespace TicketVoidingSystem.Core.Controllers
{
    [ApiController]
    [Route("api/TicketVoidingSystem/[action]")]
    public class TicketVoidingSystemApiController : ControllerBase
    {
        private readonly IMediator mediator;

        public TicketVoidingSystemApiController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetSites()
        {
            var model = await mediator.Send(new GetSitesRequest());
            return Ok(model);
        }
    }
}