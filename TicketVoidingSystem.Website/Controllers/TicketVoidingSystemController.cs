using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[Route("[controller]")]
public class TicketVoidingSystemController : Controller
{
    private readonly IMediator mediator;

    public TicketVoidingSystemController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
    public IActionResult ABExceptionList()
    {
        return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
    }

    [HttpGet]
    [Route("[action]/Index/{id}")]
    public async Task<ActionResult> VoidRequest(int id)
    {
        var isHasPermission = await mediator.Send(new CheckAccessRequestPermissionRequest { RequestId = id });
        if (isHasPermission)
        {
            return View("~/wwwroot/dist/ticket-voiding-system/void-request/index.cshtml");
        }

        return View("~/Views/NotAuthorized.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AfterVoidHistory, Policy = Constant.Policy.Read)]
    public IActionResult ManageVoidServices()
    {
        return View("~/wwwroot/dist/manage-void-services/index.cshtml");
    }

    [HttpGet]
    [Route("[action]")]
    [Route("[action]/Index")]
    [AllowAnonymous]
    public IActionResult ManageVoidServicesNoAuth()
    {
        return View("~/wwwroot/dist/manage-void-services/index.cshtml");
    }
}