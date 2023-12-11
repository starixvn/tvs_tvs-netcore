using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.CashOutTransaction.RecoverTickets.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.RecoverTickets;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecoverCashOutController : Controller
{
    private readonly IMediator mediator;

    public RecoverCashOutController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverCashOutTransaction)]
    public async Task<JsonResult> GetTickets(GetTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverCashOutTransaction, Policy = Constant.Policy.Host)]
    public async Task<JsonResult> RecoverTickets(RecoverTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}