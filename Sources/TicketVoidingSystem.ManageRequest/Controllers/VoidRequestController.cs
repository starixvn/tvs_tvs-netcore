using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

namespace TicketVoidingSystem.ManageRequest.Controllers;

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
    public async Task<IActionResult> GetRemark() => Ok(await mediator.Send(new GetRemarkRequest()));

    [HttpPost]
    public async Task<IActionResult> GetLastModifiedDate(GetLastModifiedDateRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetVoidedReason(GetReasonNameRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetTicketsMini(GetTicketsMiniRequest request) => Ok(await mediator.Send(request));

    //[HttpPost]
    //public async Task<JsonResult> InsertQueue()
    //{
    //    var request = Helper.GetModelFromJsonRequest<InsertQueueRequest>(HttpContext.Request);
    //    var result = await mediator.Send(request);
    //    return this.JsonNet(result);
    //}

    [HttpPost]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request) => Ok(await mediator.Send(request));
}