using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ManageReMarkController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> GetIPTV(GetIPTVRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> AddRemark(AddRemark request) => Ok(await mediator.Send(request));
}