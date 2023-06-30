using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AddRequestController : ControllerBase
{
    private readonly IMediator mediator;

    public AddRequestController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetIssueTypes() => Ok(await mediator.Send(new GetIssueTypesRequest()));

    [HttpPost]
    public async Task<IActionResult> GetLogInfo(GetLogInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetWrongScoreInfo(GetWrongScoreInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetLastTimeScore(GetLastTimeScoreRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetChildMatches(GetChildMatchesRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetSubIssueTypeLinkMatch(GetSubIssueTypeLinkMatchRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckTickets14(CheckTickets14Request request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckValidTransIdsRequest(CheckValidTransIdsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetLinkedLog(GetLinkedLogRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetPoolHouseTickets(GetPoolHouseTicketRequest request) => Ok(await mediator.Send(request));
}