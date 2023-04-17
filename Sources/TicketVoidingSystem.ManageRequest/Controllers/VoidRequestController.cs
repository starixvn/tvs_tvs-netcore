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

    //[HttpPost]
    //public async Task<JsonResult> GetTickets()
    //{
    //    var request = Helper.GetModelFromJsonRequest<GetTicketsRequest>(HttpContext.Request);
    //    var result = await mediator.Send(request);
    //    return this.JsonNet(result);
    //}

    //[HttpPost]
    //public async Task<JsonResult> GetTicketsMini()
    //{
    //    var request = Helper.GetModelFromJsonRequest<GetTicketsMiniRequest>(HttpContext.Request);
    //    var result = await mediator.Send(request);
    //    return this.JsonNet(result);
    //}

    //[HttpPost]
    //public async Task<JsonResult> InsertQueue()
    //{
    //    var request = Helper.GetModelFromJsonRequest<InsertQueueRequest>(HttpContext.Request);
    //    var result = await mediator.Send(request);
    //    return this.JsonNet(result);
    //}

    //public async Task<ActionResult> ExportExcel(ExportExcelRequest request)
    //{
    //    var model = await mediator.Send(request);
    //    return new ExcelResult(model.Content, model.FileName);
    //}
}