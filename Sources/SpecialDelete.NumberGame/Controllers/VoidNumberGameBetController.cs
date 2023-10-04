using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.NumberGame.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.NumberGame.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class VoidNumberGameBetController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidNumberGameBetController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetVoidTickets(GetVoidTicketsRequest request) => Ok(await mediator.Send(request));

    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidTickets(VoidTicketsRequest request) => Ok(await mediator.Send(request));
}