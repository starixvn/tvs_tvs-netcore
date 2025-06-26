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
    [HttpGet]
    [SkipLogging]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetRemark() => Ok(await mediator.Send(new GetRemarkRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByBetID, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidBet(VoidTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetAbnormalBetSubIssueTypes() => Ok(await mediator.Send(new GetAbnormalBetSubIssueTypesRequest()));
}