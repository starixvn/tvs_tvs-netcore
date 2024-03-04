using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[Route("[controller]/[action]")]
public class SportBookController : Controller
{
    private readonly SessionService sessionService;

    public SportBookController(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketExclusion, Policy = Constant.Policy.Read)]
    public IActionResult MarkTickets()
    {
        return View("~/wwwroot/dist/mark-tickets/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public IActionResult VoidSingleBet()
    {
        return View("~/wwwroot/dist/void-single-bet/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency, Policy = Constant.Policy.Read)]
    public IActionResult VoidByCurrency()
    {
        return View("~/wwwroot/dist/old-page/void-by-currency/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Read)]
    public IActionResult VoidByBetId()
    {
        ViewBag.UserName = sessionService.UserName;
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/VoidByBetId/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.CancelCashOutAction)]
    public IActionResult CancelCashOut()
    {
        ViewBag.UserName = sessionService.UserName;
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/CancelCashOut/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverCashOutTransaction)]
    public IActionResult RecoverCashOut()
    {
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverCashOut/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSportsbookBet)]
    public IActionResult RecoverBet()
    {
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverBet/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverParlayBet, Policy = Constant.Policy.Read)]
    public IActionResult RecoverParlayBet()
    {
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverParlayBet/Index.cshtml");
    }
}