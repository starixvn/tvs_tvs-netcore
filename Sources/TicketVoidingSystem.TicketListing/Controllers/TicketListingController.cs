using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.TicketListing.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TicketListingController : ControllerBase
{
    private readonly IMediator mediator;

    public TicketListingController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetLicensees() => Ok(await mediator.Send(new GetLicenseesRequest()));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetSummaryTickets(GetSummaryRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> GetTicketsDetail(GetTicketsDetailRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> SendDataToOic(SendDataToOicRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketListing, Policy = Constant.Policy.Read)]
    public async Task<IActionResult> SendCreditDataToLetsTalk(SendCreditDataToLetstalkRequest request) => Ok(await mediator.Send(request));
}