using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.Permission;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class PermissionController : ControllerBase
{
    private readonly IMediator mediator;

    public PermissionController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CheckTicketsStatus(CheckTicketsStatusRequest request) => Ok(await mediator.Send(request));
}