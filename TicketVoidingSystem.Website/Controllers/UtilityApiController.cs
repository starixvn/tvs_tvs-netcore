using Fanex.NAP.Client.AspNetCore.Session;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TicketVoidingSystem.Website.Controllers
{
    [ApiController]
    [Route("api/TicketVoidingSystem/[action]")]
    public class UtilityApiController : ControllerBase
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public UtilityApiController(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public IActionResult GetNapUserInfo()
        {
            var session = new NapSession(httpContextAccessor);
            var viewModel = new
            {
                MenuItem = session.MenuItemList,
                UserName = session.UserName,
                UserId = session.UserId
            };

            return Ok(viewModel);
        }
    }
}