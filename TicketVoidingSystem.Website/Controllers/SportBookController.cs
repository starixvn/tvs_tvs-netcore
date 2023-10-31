using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
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

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public IActionResult VoidSingleBet()
    {
        return View("~/wwwroot/dist/void-single-bet/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency, Policy = Constant.Policy.Read)]
    public IActionResult VoidByCurrency()
    {
        return View("~/wwwroot/dist/old-page/void-by-currency/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Read)]
    public IActionResult VoidByBetId()
    {
        return View("~/wwwroot/dist/old-page/void-by-currency/index.cshtml");
    }
}