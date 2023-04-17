using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

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

    [HttpPost]
    public async Task<IActionResult> GetRequests(SelectRequestsRequest request) => Ok(await mediator.Send(request));
}