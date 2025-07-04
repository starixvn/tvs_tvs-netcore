using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[Route("[controller]/[action]")]
[SkipLogging]
public class SportBookController(SessionService sessionService, UserActionLogService userActionLogService)
    : Controller
{
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
        userActionLogService.LogAccessFunction(nameof(VoidSingleBet));
        return View("~/wwwroot/dist/void-single-bet/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency, Policy = Constant.Policy.Read)]
    public IActionResult VoidByCurrency()
    {
        userActionLogService.LogAccessFunction(nameof(VoidByCurrency));
        return View("~/wwwroot/dist/old-page/void-by-currency/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Read)]
    public IActionResult VoidByBetId()
    {
        userActionLogService.LogAccessFunction(nameof(VoidByBetId));
        return View("~/wwwroot/dist/void-by-bet-id/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.CancelCashOutAction)]
    public IActionResult CancelCashOut()
    {
        userActionLogService.LogAccessFunction(nameof(SpecialDeleteFunctionKeys.CancelCashOutAction));
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
        userActionLogService.LogAccessFunction(nameof(SpecialDeleteFunctionKeys.RecoverCashOutTransaction));
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverCashOut/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSportsbookBet)]
    public IActionResult RecoverBet()
    {
        userActionLogService.LogAccessFunction(nameof(SpecialDeleteFunctionKeys.RecoverSportsbookBet));
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverBet/Index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverParlayBet, Policy = Constant.Policy.Read)]
    public IActionResult RecoverParlayBet()
    {
        userActionLogService.LogAccessFunction(nameof(RecoverParlayBet));
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/RecoverParlayBet/Index.cshtml");
    }
}