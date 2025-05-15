using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.Notification;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class NotificationController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await mediator.Send(new GetNotificationRequest()));

    [HttpPost]
    public async Task<IActionResult> Update(UpdateNotificationRequest request) => Ok(await mediator.Send(request));
}