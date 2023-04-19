using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Session;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class SharedApiController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly IHttpContextAccessor httpContextAccessor;

    public SharedApiController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
    {
        this.mediator = mediator;
        this.httpContextAccessor = httpContextAccessor;
    }

    [HttpGet]
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
    public async Task<IActionResult> GetBalanceUp() => Ok(await mediator.Send(new GetBalanceUpDayRequest()));

    [HttpGet]
    public async Task<IActionResult> GetBalanceUpZoneManila() => Ok(await mediator.Send(new GetBalanceUpDayZoneManilaRequest()));

    [HttpGet]
    public async Task<IActionResult> GetSportsType() => Ok(await mediator.Send(new GetSportsTypeRequest()));

    [HttpPost]
    public async Task<IActionResult> GetVoidResultCache(GetVoidResultCacheRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetIssueTypes() => Ok(await mediator.Send(new GetIssueTypesRequest()));
}