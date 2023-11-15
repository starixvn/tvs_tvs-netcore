using Fanex.NAP.Client.Attributes;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

using Fanex.NAP.Client.Helpers.Business;
using TicketVoidingSystem.Extensions;

[ApiController]
[Route("api/[controller]/[action]")]
public class AddRequestController : ControllerBase
{
    private readonly IMediator mediator;

    public AddRequestController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> GetLogInfo(GetLogInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetWrongScoreInfo(GetWrongScoreInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetLastTimeScore(GetLastTimeScoreRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetChildMatches(GetChildMatchesRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetSubIssueTypeLinkMatch(GetSubIssueTypeLinkMatchRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckTickets14(CheckTickets14Request request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckValidTransIdsRequest(CheckValidTransIdsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckValidUsernames(CheckValidUsernamesRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> CheckDuplicateTickets(CheckDuplicateTicketsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetLinkedLog(GetLinkedLogRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetSubIssueTypeNote(GetSubIssueTypeNoteRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> SaveSubIssueTypeNote(SaveSubIssueTypeNoteRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetPoolHouseTickets(GetPoolHouseTicketRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetReducedOverBetTypes(GetReducedOverBetTypesRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetOperators(GetOperatorsRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetProvider(GetProviderRequest request) => Ok(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.TicketVoidingManageRequest, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<IActionResult> AddRequest(AddRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> ExportExcel(ExportTicketAbnormalBetRequest request)
    {
        var model = await mediator.Send(request);
        return this.ExcelFileResult(Response, model);
    }
}