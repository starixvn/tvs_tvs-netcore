using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VirtualSports.RecoverBet.Handlers;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VirtualSports.RecoverBet.Controllers;

[ApiController]
[Route("api/VirtualSports/[controller]/[action]")]
public class RecoverVirtualSportsBetController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverVirtualSportsBet)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverVirtualSportsBet, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> RecoverTickets(RecoverTicketsRequest request) => Ok(await mediator.Send(request));
}