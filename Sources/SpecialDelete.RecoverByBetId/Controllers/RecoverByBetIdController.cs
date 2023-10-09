using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.RecoverByBetId.Handlers;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverByBetId.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecoverByBetIdController : ControllerBase
{
    private readonly IMediator mediator;

    public RecoverByBetIdController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverByBetID)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverByBetID, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> RecoverTickets(RecoverTicketsRequest request) => Ok(await mediator.Send(request));
}