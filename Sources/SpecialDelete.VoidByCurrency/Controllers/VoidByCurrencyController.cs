using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VoidByCurrency.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByCurrency.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class VoidByCurrencyController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidByCurrencyController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency)]
    public async Task<IActionResult> GetFilterModel() => Ok(await mediator.Send(new GetFilterModelRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidByCurrency, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidTickets(VoidTicketsRequest request) => Ok(await mediator.Send(request));
}