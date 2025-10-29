using System.Text.Json;
using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[Route("[controller]/[action]")]
[SkipLogging]
public class TicketVoidingSystemController(IMediator mediator, UserActionLogService userActionLogService)
    : Controller
{
    [HttpPost]
    [Route("")]
    [AllowAnonymous]
    public ActionResult AddRequestFromCTS(AddRequestFromCTSModel model)
    {
        TempData["AddRequestFromCTS"] = JsonSerializer.Serialize(model);
        var routeValues = new
        {
            userId = model.UserId,
            onuserId = model.OnUserId,
            time = model.Time,
            redirectUrl = "/AddRequestFromOtherSites/CTS"
        };

        return RedirectToAction("SSO", "Auth", routeValues);
    }

    [HttpGet]
    [Route("Index/{id}")]
    public ActionResult EditRequest(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/edit-request/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AfterVoidHistory, Policy = Constant.Policy.Read)]
    public IActionResult ManageVoidServices()
    {
        return View("~/wwwroot/dist/manage-void-services/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [AllowAnonymous]
    public IActionResult ManageVoidServicesNoAuth()
    {
        ViewBag.IsAllowAnonymousPage = true;
        return View("~/wwwroot/dist/manage-void-services/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
    public IActionResult ABExceptionList()
    {
        userActionLogService.LogAccessFunction(nameof(ABExceptionList));
        return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
    }

    [HttpGet]
    [Route("Index/{id}")]
    public async Task<ActionResult> VoidRequest(int id)
    {
        var isHasPermission = await mediator.Send(new CheckAccessRequestPermissionRequest { RequestId = id });
        if (!isHasPermission)
        {
            return View("~/Views/Auth/AccessDenied.cshtml");
        }

        userActionLogService.LogAccessFunction(nameof(VoidRequest));
        return View("~/wwwroot/dist/ticket-voiding-system/void-request/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    public IActionResult ManageRequest()
    {
        userActionLogService.LogAccessFunction(nameof(ManageRequest));
        return View("~/wwwroot/dist/ticket-voiding-system/manage-request/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    public ActionResult AddRequest()
    {
        return View("~/wwwroot/dist/ticket-voiding-system/add-request/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ArchivedTicket, Policy = Constant.Policy.Read)]
    public ActionResult ArchivedTicket(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/archived-ticket/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.DangerAccepted, Policy = Constant.Policy.Read)]
    public ActionResult DangerAccepted(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/danger-accepted/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RedCard, Policy = Constant.Policy.Read)]
    public ActionResult RedCard(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/red-card/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongScore, Policy = Constant.Policy.Read)]
    public ActionResult WrongScore(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-score/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TechnicalError, Policy = Constant.Policy.Read)]
    public ActionResult TechnicalError(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/technical-error/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongHDP, Policy = Constant.Policy.Read)]
    public ActionResult WrongHdp(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.WrongHDP;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-hdp/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.Wrong1stHDP, Policy = Constant.Policy.Read)]
    public ActionResult Wrong1stHdp(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.Wrong1stHDP;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-hdp/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, Policy = Constant.Policy.Read)]
    public ActionResult EarlyKickOff(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.EarlyKickOffTime;
        return View("~/wwwroot/dist/ticket-voiding-system/early-kick-off/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, Policy = Constant.Policy.Read)]
    public ActionResult WrongKickOffTime(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.WrongKickOffTime;
        return View("~/wwwroot/dist/ticket-voiding-system/early-kick-off/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongMarketOffered, Policy = Constant.Policy.Read)]
    public ActionResult WrongMarketOffered(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.WrongMarketOffered;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-market-offered/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongOfferedName, Policy = Constant.Policy.Read)]
    public ActionResult WrongOfferedName(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.WrongOfferedName;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-offered-name/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongOU, Policy = Constant.Policy.Read)]
    public ActionResult WrongOu(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.WrongOU;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-ou/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.Wrong1stOU, Policy = Constant.Policy.Read)]
    public ActionResult Wrong1stOu(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.Wrong1stOU;
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-ou/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongOdds, Policy = Constant.Policy.Read)]
    public ActionResult WrongOdds(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-odds/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.WrongOddsSportsBook, Policy = Constant.Policy.Read)]
    public ActionResult WrongOddsSportsBook(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-odds-sports-book/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AbnormalAccount, Policy = Constant.Policy.Read)]
    public ActionResult AbnormalAccount(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/abnormal-accounts/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet, Policy = Constant.Policy.Read)]
    public ActionResult AbnormalBet(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/abnormal-bet/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.DuplicateTickets, Policy = Constant.Policy.Read)]
    public ActionResult DuplicateTickets(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/duplicate-tickets/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverTicket, Policy = Constant.Policy.Read)]
    public ActionResult RecoverTicket(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/recover-ticket/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.OtherIssues, Policy = Constant.Policy.Read)]
    public ActionResult OtherIssues(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.OtherIssues;
        return View("~/wwwroot/dist/ticket-voiding-system/other-issues/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.MatchEarlyCompleted, Policy = Constant.Policy.Read)]
    public ActionResult MatchEarlyCompleted(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.MatchEarlyCompleted;
        return View("~/wwwroot/dist/ticket-voiding-system/other-issues/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.NotParticipate, Policy = Constant.Policy.Read)]
    public ActionResult NotParticipate(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/not-participate/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ReducedOver, Policy = Constant.Policy.Read)]
    public ActionResult ReducedOver(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.ReducedOver;
        return View("~/wwwroot/dist/ticket-voiding-system/reduced-over/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.Abandoned, Policy = Constant.Policy.Read)]
    public ActionResult Abandoned(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.Abandoned;
        return View("~/wwwroot/dist/ticket-voiding-system/reduced-over/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.SecondTeamBatting, Policy = Constant.Policy.Read)]
    public ActionResult SecondTeamBatting(int id)
    {
        ViewBag.IssueTypeId = IssueTypeConstant.SecondTeamBatting;
        return View("~/wwwroot/dist/ticket-voiding-system/technical-error/index.cshtml");
    }
}