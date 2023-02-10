using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

public class MenuController : Controller
{
    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public IActionResult TicketListing()
    {
        return View("~/wwwroot/dist/ticket-listing/index.cshtml");
    }
}