using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class MessageTemplateController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [SkipLogging]
    public async Task<IActionResult> GetTemplateSettings() => Ok(await mediator.Send(new GetTemplateSettingRequest()));

    [HttpGet]
    public async Task<IActionResult> GetTemplateAbnormalBet() => Ok(await mediator.Send(new GetTemplateAbnormalBetRequest()));

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> GetSpecialBetTypeContent(GetSpecialBetTypeContentRequest request) => Ok(await mediator.Send(request));
}