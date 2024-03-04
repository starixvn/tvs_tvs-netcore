using System.Text.Json;
using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

using Fanex.NAP.Client.Helpers.Business;
using TicketVoidingSystem.ManageRequest.Models;

[Route("[controller]/[action]")]
public class TicketVoidingSystemController : Controller
{
    private readonly IMediator mediator;

    public TicketVoidingSystemController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
    public IActionResult ABExceptionList()
    {
        return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
    }

    [HttpGet]
    [Route("Index/{id}")]
    public async Task<ActionResult> VoidRequest(int id)
    {
        var isHasPermission = await mediator.Send(new CheckAccessRequestPermissionRequest { RequestId = id });
        if (isHasPermission)
        {
            return View("~/wwwroot/dist/ticket-voiding-system/void-request/index.cshtml");
        }

        return View("~/Views/Auth/AccessDenied.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    public ActionResult ManageRequest()
    {
        return View("~/wwwroot/dist/ticket-voiding-system/manage-request/index.cshtml");
    }

    [HttpGet]
    [Route("")]
    [Route("Index")]
    public ActionResult AddRequest()
    {
        return View("~/wwwroot/dist/ticket-voiding-system/add-request/index.cshtml");
    }

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
        return View("~/wwwroot/dist/manage-void-services/index.cshtml");
    }
}