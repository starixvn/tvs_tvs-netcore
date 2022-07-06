using Fanex.NAP.Client.AspNetCore.Session;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Utility.Models;

namespace TicketVoidingSystem.Utility.Controllers
{
    [ApiController]
    [Route("api/TicketVoidingSystem/[action]")]
    public class TicketVoidingSystemApiController : ControllerBase
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public TicketVoidingSystemApiController(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
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