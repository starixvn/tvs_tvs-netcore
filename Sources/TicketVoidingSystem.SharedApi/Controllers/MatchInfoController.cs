using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.MatchInfo;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class MatchInfoController : ControllerBase
{
    private readonly IMediator mediator;

    public MatchInfoController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> GetInfo(GetMatchInfoRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetInfoForAddRequest(GetMatchInfoForAddRequest request) => Ok(await mediator.Send(request));

    [HttpGet]
    [Route("{matchId:int}")]
    public async Task<IActionResult> GetFirstTimeAndKickOffTime(int matchId) => Ok(await mediator.Send(new GetFirstTimeAndKickOffTimeRequest { MatchId = matchId }));
}