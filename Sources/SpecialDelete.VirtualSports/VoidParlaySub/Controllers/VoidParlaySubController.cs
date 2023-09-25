using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Controllers;

[Route("api/VirtualSports/[controller]/[action]")]
public class VoidParlaySubController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidParlaySubController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    //[NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    //public async Task<ActionResult> Index()
    //{
    //    var viewModel = await mediator.Send(new IndexRequest()).ConfigureAwait(false);
    //    viewModel.Root = Url.Content("~");

    //    return View("~/dist/void-parlay-sub-virtual-sports/index.cshtml", viewModel);
    //}

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidTickets(VoidTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidParlaySubBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }
}