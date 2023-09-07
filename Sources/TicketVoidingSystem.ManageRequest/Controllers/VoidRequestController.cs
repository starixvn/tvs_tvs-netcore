using Fanex.NAP.Client.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/[controller]/[action]")]
public class VoidRequestController : ControllerBase
{
    private readonly IMediator mediator;

    public VoidRequestController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetRemark() => Ok(await mediator.Send(new GetRemarkRequest()));

    [HttpPost]
    public async Task<IActionResult> GetLastModifiedDate(GetLastModifiedDateRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetVoidedReason(GetReasonNameRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTicketsMini(GetTicketsMiniRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVoidTickets, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> InsertQueue(InsertQueueRequest request) => Ok(await mediator.Send(request));
}