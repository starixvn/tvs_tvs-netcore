using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.RecoverParlayBet.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverParlayBet.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecoverMainParlayController : ControllerBase
{
    private readonly IMediator mediator;

    public RecoverMainParlayController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverMainParlayBet, Policy = Constant.Policy.Read)]
    [HttpPost]
    public async Task<JsonResult> GetTickets(GetMainTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverMainParlayBet, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> Recover(RecoverMainTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}