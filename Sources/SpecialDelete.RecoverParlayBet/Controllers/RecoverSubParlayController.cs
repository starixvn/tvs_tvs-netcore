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
public class RecoverSubParlayController : ControllerBase
{
    private readonly IMediator mediator;

    public RecoverSubParlayController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSubParlayBet, Policy = Constant.Policy.Read)]
    [HttpPost]
    public async Task<JsonResult> GetTickets(GetSubTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSubParlayBet, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> Recover(RecoverSubTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}