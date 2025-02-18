using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.Analytics;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[SkipLogging]
public class AnalyticsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> LogAccessFunction(LogAccessFunctionRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> LogChangeContent(LogChangeContentRequest request) => Ok(await mediator.Send(request));
}