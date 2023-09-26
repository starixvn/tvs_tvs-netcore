using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Controllers;

[ApiController]
[Route("api/VirtualSports/[controller]/[action]")]
public class VoidParlaySubBetController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidParlaySubBetController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidTickets(VoidTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }
}