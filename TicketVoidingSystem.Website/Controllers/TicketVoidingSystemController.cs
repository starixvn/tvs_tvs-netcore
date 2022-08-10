using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers
{
    [Route("[controller]")]
    public class TicketVoidingSystemController : Controller
    {
        [HttpGet]
        [Route("[action]")]
        [Route("[action]/Index")]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public IActionResult ABExceptionList()
        {
            return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
        }
    }
}