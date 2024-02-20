using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BetTypesController : ControllerBase
{
    private readonly IMediator mediator;

    public BetTypesController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> GetGroupBetTypesNg(GetGroupBetTypesRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetBetTeams() => Ok(await mediator.Send(new GetBetTeamsRequest()));

    [HttpPost]
    public async Task<IActionResult> GetOddsInfoSpecialBetTypes(GetOddsInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetVirtualSport(GetBetTypesVirtualSportRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetBetTypes(GetBetTypesRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    public async Task<IActionResult> GetVoidParlayVirtualSport() => Ok(await mediator.Send(new GetBetTypesVoidParlayVirtualSportRequest()));
}