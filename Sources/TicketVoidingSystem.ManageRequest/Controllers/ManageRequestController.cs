using Fanex.NAP.Client.AspNetCore.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ManageRequestController : ControllerBase
{
    private readonly IMediator mediator;

    public ManageRequestController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetIssueTypeName(int id) => Ok(await mediator.Send(new GetIssueNameRequest { SubId = id }));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    [Route("{id}")]
    public async Task<IActionResult> GetRequest(int id) => Ok(await mediator.Send(new GetRequestRequest { RequestId = id }));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetRequests(SelectRequestsRequest request) => Ok(await mediator.Send(request));
}