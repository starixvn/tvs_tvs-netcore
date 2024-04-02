using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.SendEmail;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[RequestSizeLimit(300_000_000)]
public class SendEmailController : ControllerBase
{
    private readonly IMediator mediator;

    public SendEmailController(IMediator mediator)
    {
        this.mediator = mediator;
    }

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