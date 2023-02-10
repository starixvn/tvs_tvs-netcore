using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[Route("[controller]")]
public class SportBookController : Controller
{
    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketExclusion, Policy = Constant.Policy.Read)]
    public IActionResult MarkTickets()
    {
        return View("~/wwwroot/dist/mark-tickets/index.cshtml");
    }
}