using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.Permission;

[ApiController]
[Route("api/[controller]/[action]")]
public class NotificationController
    (IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> GetNotification(CheckTicketsStatusRequest request) => Ok(await mediator.Send(request));
}