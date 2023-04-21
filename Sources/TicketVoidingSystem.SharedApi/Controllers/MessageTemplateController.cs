using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class MessageTemplateController : ControllerBase
{
    private readonly IMediator mediator;

    public MessageTemplateController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTemplateSettings() => Ok(await mediator.Send(new GetTemplateSettingRequest()));
}