using System.Threading.Tasks;
using Fanex.NAP.Client;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class SharedApiController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
    : ControllerBase
{
    [HttpGet]
    [SkipLogging]
    public IActionResult GetNapUserInfo()
    {
        var session = new NapSession(httpContextAccessor);
        var viewModel = new
        {
            MenuItem = session.MenuItemList,
            session.UserName,
            session.UserId
        };

        return Ok(viewModel);
    }

    [HttpGet]
    [SkipLogging]
    public async Task<IActionResult> GetBalanceUp() => Ok(await mediator.Send(new GetBalanceUpDayRequest()));

    [HttpGet]
    public async Task<IActionResult> GetBalanceUpZoneManila() => Ok(await mediator.Send(new GetBalanceUpDayZoneManilaRequest()));

    [HttpGet]
    public async Task<IActionResult> GetSportsType() => Ok(await mediator.Send(new GetSportsTypeRequest()));

    [HttpPost]
    public async Task<IActionResult> GetVoidResultCache(GetVoidResultCacheRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetSimpleResultCache(GetSimpleResultCacheRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    [SkipLogging]
    public async Task<IActionResult> GetIssueTypes() => Ok(await mediator.Send(new GetIssueTypesRequest()));

    [HttpGet]
    [Route("{id}")]
    [SkipLogging]
    public async Task<IActionResult> GetSubIssueType(int id) => Ok(await mediator.Send(new GetSubIssueTypeRequest { IssueTypeId = id }));

    [HttpGet]
    [SkipLogging]
    public async Task<IActionResult> GetIssueTypePermissionList() => Ok(await mediator.Send(new GetIssueTypePermissionListRequest()));

    [HttpPost]
    public async Task<IActionResult> CheckNegativeBalance(CheckNegativeBalanceRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetGroupLicensees() => Ok(await mediator.Send(new GetGroupLicenseesRequest()));

    [HttpGet]
    public async Task<IActionResult> GetCurrencies() => Ok(await mediator.Send(new GetCurrenciesRequest()));
}