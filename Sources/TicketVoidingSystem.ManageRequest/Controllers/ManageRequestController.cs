using Fanex.NAP.Client.AspNetCore.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ManageRequestController : ControllerBase
{
    private readonly IMediator mediator;

    public ManageRequestController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetIssueTypeName(int id) => Ok(await mediator.Send(new GetIssueNameRequest { SubId = id }));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    [Route("{id}")]
    public async Task<IActionResult> GetRequest(int id) => Ok(await mediator.Send(new GetRequestRequest { RequestId = id }));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetRequests(SelectRequestsRequest request) => Ok(await mediator.Send(request));

    //public async Task<ActionResult> ExportRequest(ExportExcelRequest request)
    //{
    //    var model = await mediator.Send(request);
    //    return new ExcelResult(model.Content, model.FileName);
    //}

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetVoidedTickets(GetVoidedTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> ExportVoidedTickets(ExportVoidedTicketsRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetGeneralInfo(GetGeneralInfoRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetMarkedTicketsCount() => Ok(await mediator.Send(new GetMarkedTicketsCountRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest)]
    public async Task<IActionResult> CheckBy(CheckByRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest)]
    public async Task<IActionResult> CopyRequestInfo(CopyRequestInfoRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetPermissionManage() => Ok(await mediator.Send(new GetPermissionManageRequest()));
}