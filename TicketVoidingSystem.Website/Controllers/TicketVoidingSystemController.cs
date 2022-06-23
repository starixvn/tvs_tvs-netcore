using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.Website.Controllers
{
    [Route("[controller]/[action]")]
    public class TicketVoidingSystemController : Controller
    {
        [HttpGet]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public IActionResult ABExceptionList()
        {
            return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
        }
    }
}