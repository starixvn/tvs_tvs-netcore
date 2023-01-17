using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet]
        [Route("[action]")]
        [Route("[action]/Index")]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AfterVoidHistory, Policy = Constant.Policy.Read)]
        public IActionResult ManageVoidServices()
        {
            return View("~/wwwroot/dist/manage-void-services/index.cshtml");
        }

        [HttpGet]
        [Route("[action]")]
        [Route("[action]/Index")]
        [AllowAnonymous]
        public IActionResult ManageVoidServicesNoAuth()
        {
            return View("~/wwwroot/dist/manage-void-services/index.cshtml");
        }
    }
}