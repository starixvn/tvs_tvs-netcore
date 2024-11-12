using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VoidByBetId.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByBetId.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class VoidByBetIdController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID)]
    public async Task<JsonResult> GetTickets(GetTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID)]
    public async Task<JsonResult> CheckUsername(CheckUserNameRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> VoidBet(VoidTicketsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}