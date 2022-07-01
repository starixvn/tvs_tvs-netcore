using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Session;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Utility.Handlers;
using TicketVoidingSystem.Utility.Models;

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

        [HttpGet]
        public IActionResult GetUserInfo()
        {
            var session = new NapSession(new HttpContextAccessor());
            var viewModel = new UserViewModel()
            {
                MenuItem = session.MenuItemList,
                UserName = session.UserName,
                UserId = session.UserId
            };

            return Ok(viewModel);
        }
    }
}