using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Session;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Utility.Handlers;
using TicketVoidingSystem.Utility.Models;

namespace TicketVoidingSystem.Utility.Controllers
{
    [ApiController]
    [Route("api/TicketVoidingSystem/[action]")]
    public class TicketVoidingSystemApiController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IHttpContextAccessor httpContextAccessor;

        public TicketVoidingSystemApiController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
        {
            this.mediator = mediator;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetSites()
        {
            var model = await mediator.Send(new GetSitesRequest());
            return Ok(model);
        }

        [HttpGet]
        public IActionResult GetNapUserInfo()
        {
            var session = new NapSession(httpContextAccessor);
            var viewModel = new NapUserViewModel
            {
                MenuItem = session.MenuItemList,
                UserName = session.UserName,
                UserId = session.UserId
            };

            return Ok(viewModel);
        }
    }
}