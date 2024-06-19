using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator mediator;

    public AnalyticsController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> LogChangeContent(LogChangeContentRequest request) => Ok(await mediator.Send(request));
}