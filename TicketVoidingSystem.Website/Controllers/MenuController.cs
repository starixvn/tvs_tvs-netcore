using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
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

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.UploadBatchMsg, Policy = Constant.Policy.Read)]
    public IActionResult UploadBatchMessage()
    {
        return View("~/Views/UploadBatchMessage/Index.cshtml");
    }

    [HttpGet]
    [Route("VirtualSports/[action]")]
    [Route("VirtualSports/[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public IActionResult VoidParlaySubBet()
    {
        return View("~/wwwroot/dist/old-page/void-parlay-sub-virtual-sports/index.cshtml");
    }

    [HttpGet]
    [Route("VirtualSports/[action]")]
    [Route("VirtualSports/[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverVirtualSportsBet, Policy = Constant.Policy.Read)]
    public IActionResult RecoverVirtualSportsBet()
    {
        return View("~/wwwroot/dist/old-page/recover-virtual-sports-bet/index.cshtml");
    }
}