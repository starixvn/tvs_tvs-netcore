using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.NumberGame.Handlers;
using TicketVoidingSystem.Web;

namespace SpecialDelete.NumberGame.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class NumberGameController : ControllerBase
{
    private readonly IMediator mediator;

    public NumberGameController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    //[NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Read)]
    //public async Task<ActionResult> Index()
    //{
    //    var viewModel = await mediator.Send(new IndexRequest()).ConfigureAwait(false);
    //    viewModel.Root = Url.Content("~");
    //    return View("~/dist/void-number-game-bet/index.cshtml", viewModel);
    //}
    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetVoidTickets(GetVoidTicketsRequest request) => Ok(await mediator.Send(request));

    public async Task<ActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request).ConfigureAwait(false);
        return new ExcelResult(model.Content, model.FileName);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidNumberGameBet, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> VoidTickets(VoidTicketsRequest request) => Ok(await mediator.Send(request));
}