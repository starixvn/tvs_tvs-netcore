using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class SubParlayTicketController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> GetNormalParlay(GetNormalParlayRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetComboParlay(GetComboParlayRequest request) => Ok(await mediator.Send(request));

    [HttpPost]
    public async Task<IActionResult> GetSelectionsSMP(GetSelectionsSMPRequest request) => Ok(await mediator.Send(request));
}