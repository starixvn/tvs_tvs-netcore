using Fanex.NAP.Client.AspNetCore.Session;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TicketVoidingSystem.SharedApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class SharedApiController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IHttpContextAccessor httpContextAccessor;

        public SharedApiController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
        {
            this.mediator = mediator;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public IActionResult GetNapUserInfo()
        {
            var session = new NapSession(httpContextAccessor);
            var viewModel = new
            {
                MenuItem = session.MenuItemList,
                session.UserName,
                session.UserId
            };

            return Ok(viewModel);
        }
    }
}