using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[SkipLogging]
public class MenuController(UserActionLogService userActionLogService) : Controller
{
    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> TicketListing()
    {
        await userActionLogService.LogAccessFunction(nameof(TicketListing));
        return View("~/wwwroot/dist/ticket-listing/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.UploadBatchMsg, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> UploadBatchMessage()
    {
        await userActionLogService.LogAccessFunction(nameof(UploadBatchMessage));
        ViewBag.IsPageUsingJquery = true;
        return View("~/Views/UploadBatchMessage/Index.cshtml");
    }

    [HttpGet]
    [Route("VirtualSports/[action]")]
    [Route("VirtualSports/[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> VoidParlaySubBet()
    {
        await userActionLogService.LogAccessFunction(nameof(VoidParlaySubBet));
        return View("~/wwwroot/dist/old-page/void-parlay-sub-virtual-sports/index.cshtml");
    }

    [HttpGet]
    [Route("VirtualSports/[action]")]
    [Route("VirtualSports/[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverVirtualSportsBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> RecoverVirtualSportsBet()
    {
        await userActionLogService.LogAccessFunction(nameof(RecoverVirtualSportsBet));
        return View("~/wwwroot/dist/old-page/recover-virtual-sports-bet/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverByBetID, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> RecoverByBetId()
    {
        await userActionLogService.LogAccessFunction(nameof(RecoverByBetId));
        return View("~/wwwroot/dist/old-page/recover-by-betid/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> VoidNumberGameBet()
    {
        await userActionLogService.LogAccessFunction(nameof(VoidNumberGameBet));
        return View("~/wwwroot/dist/old-page/void-number-game-bet/index.cshtml");
    }
}