using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.VoidSingleBet.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class VoidSingleBetController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidSingleBetController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    //public async Task<ActionResult> Index()
    //{
    //    var viewModel = await mediator.Send(new IndexRequest()).ConfigureAwait(false);
    //    viewModel.Root = Url.Content("~");
    //    return View("~/dist/void-single-bet/index.cshtml", viewModel);
    //}

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetRemark() => Ok(await mediator.Send(new GetRemarkRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetLogInfo(GetLogInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.VoidSingleBet, Policy = Constant.Policy.Host)]
    public async Task<JsonResult> VoidTickets(VoidTicketsRequest request)
    {
        var model = await mediator.Send(request).ConfigureAwait(false);
        return this.JsonNet(model);
    }
}