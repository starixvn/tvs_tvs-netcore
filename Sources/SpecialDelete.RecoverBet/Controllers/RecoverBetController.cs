using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.RecoverBet.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverBet.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecoverBetController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSportsbookBet)]
    public async Task<JsonResult> GetTickets(GetTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSportsbookBet, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> RecoverTickets(RecoverTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}