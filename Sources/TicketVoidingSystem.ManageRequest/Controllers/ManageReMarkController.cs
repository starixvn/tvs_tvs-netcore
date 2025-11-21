using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ManageReMarkController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> GetIPTV(GetIPTVRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> AddRemark(AddRemark request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetRemarks(GetRemarks request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> UpdateRemark(UpdateRemark request) => Ok(await mediator.Send(request));

    [HttpDelete]
    [Route("{remarkId}")]
    public async Task<IActionResult> DeleteRemark(int remarkId) => Ok(await mediator.Send(new DeleteRemark { RemarkId = remarkId }));

    [HttpPost]
    public async Task<ActionResult> ExportRemark(ExportRemark request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpGet]
    [Route("{remarkId}")]
    public async Task<IActionResult> GetRemark(int remarkId) => Ok(await mediator.Send(new GetRemarkRequest { RemarkId = remarkId }));
}