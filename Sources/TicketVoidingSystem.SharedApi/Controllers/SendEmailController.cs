using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[RequestSizeLimit(300_000_000)] // NOSONAR
public class SendEmailController(IMediator mediator) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Send(SendEmailApiRequest request) => Ok(await mediator.Send(request));

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> SendEmailDuplicateTickets(SendEmailApiDuplicateTicketsRequest request) => Ok(await mediator.Send(request));

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> SendEmailRecoverTickets(SendEmailRecoverApiRequest request) => Ok(await mediator.Send(request));
}