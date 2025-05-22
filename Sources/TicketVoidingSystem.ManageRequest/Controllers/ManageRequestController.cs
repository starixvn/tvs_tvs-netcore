using Fanex.NAP.Client.Attributes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/[controller]/[action]")]
public class ManageRequestController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [SkipLogging]
    public async Task<IActionResult> GetVoidActions() => Ok(await mediator.Send(new GetVoidActionsRequest()));

    [HttpGet]
    [Route("{id}")]
    [SkipLogging]
    public async Task<IActionResult> GetIssueTypeName(int id) => Ok(await mediator.Send(new GetIssueNameRequest { SubId = id }));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    [Route("{id}")]
    public async Task<IActionResult> GetRequest(int id) => Ok(await mediator.Send(new GetRequestRequest { RequestId = id }));

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetRequestNoAuth(int id) => Ok(await mediator.Send(new GetRequestRequest { RequestId = id }));

    [HttpPost]
    [SkipLogging]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetRequests(SelectRequestsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<ActionResult> ExportRequest(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

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
    [SkipLogging]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingRequest)]
    public async Task<IActionResult> GetMarkedTicketsCount() => Ok(await mediator.Send(new GetMarkedTicketsCountRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingVerifyRequest)]
    public async Task<IActionResult> CheckBy(CheckByRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CopyRequestInfo(CopyRequestInfoRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetPermissionManage() => Ok(await mediator.Send(new GetPermissionManageRequest()));

    [HttpPost]
    public async Task<IActionResult> GetBriefInfo(GetBriefInfoRequest request) => Ok(await mediator.Send(request));

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> GetExcelVoidedTicketForSendLetstalk(GetExcelVoidedTicketForSendLetstalkRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> UpdateRequest(EditRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> UpdateStatusRequest(UpdateStatusRequest request) => Ok(await mediator.Send(request));
}