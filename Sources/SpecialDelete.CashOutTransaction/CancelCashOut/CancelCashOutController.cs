using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.CashOutTransaction.CancelCashOut.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.CancelCashOut;

[ApiController]
[Route("api/[controller]/[action]")]
public class CancelCashOutController : Controller
{
    private readonly IMediator mediator;

    public CancelCashOutController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.CancelCashOutAction)]
    public async Task<JsonResult> GetTickets(GetTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.CancelCashOutAction, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> VoidTickets(VoidTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.CancelCashOutAction)]
    public async Task<ActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }
}