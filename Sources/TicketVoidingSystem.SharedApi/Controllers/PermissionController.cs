using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.SharedApi.Handlers.Permission;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class PermissionController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CheckTicketsStatus(CheckTicketsStatusRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckTicketsStatusJqueryPage(CheckTicketsStatusRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}