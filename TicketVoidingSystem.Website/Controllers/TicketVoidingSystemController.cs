using System.Text.Json;
using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    [IssueTypeAuth(SpecialDeleteFunctionKeys.ArchivedTicket, Constant.Policy.Read)]
    public ActionResult ArchivedTicket(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/archived-ticket/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [IssueTypeAuth(SpecialDeleteFunctionKeys.DangerAccepted, Constant.Policy.Read)]
    public ActionResult DangerAccepted(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/danger-accepted/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [IssueTypeAuth(SpecialDeleteFunctionKeys.RedCard, Constant.Policy.Read)]
    public ActionResult RedCard(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/red-card/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [IssueTypeAuth(SpecialDeleteFunctionKeys.WrongScore, Constant.Policy.Read)]
    public ActionResult WrongScore(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/wrong-score/index.cshtml");
    }

    [HttpGet]
    [Route("Add")]
    [Route("Add/Index")]
    [Route("Edit/{id}")]
    [IssueTypeAuth(SpecialDeleteFunctionKeys.TechnicalError, Constant.Policy.Read)]
    public ActionResult TechnicalError(int id)
    {
        return View("~/wwwroot/dist/ticket-voiding-system/technical-error/index.cshtml");
    }
}