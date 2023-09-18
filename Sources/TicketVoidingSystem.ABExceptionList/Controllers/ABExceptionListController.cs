using System.Threading.Tasks;
using Fanex.NAP.Client.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ABExceptionList.Controllers;

using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/[controller]/[action]")]
public class ABExceptionListController : ControllerBase
{
    private readonly IMediator mediator;

    public ABExceptionListController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> CheckUsernames(CheckUsernamesRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> AddUsers(AddUsersRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> RemoveUsers(RemoveUsersRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetUsers(GetUsersRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetPermission() => Ok(await mediator.Send(new GetPermissionRequest()));

    [HttpGet]
    public async Task<IActionResult> GetSubType() => Ok(await mediator.Send(new GetSubTypeRequest()));

    [HttpGet]
    public async Task<IActionResult> GetSites() => Ok(await mediator.Send(new GetSitesRequest()));
}