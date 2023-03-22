using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageVoidServices.Handlers;

namespace TicketVoidingSystem.ManageVoidServices.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[AllowAnonymous]
public class ManageVoidServicesController : ControllerBase
{
    private readonly IMediator mediator;

    public ManageVoidServicesController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> GetVoidBetAutomationServiceInfo(GetVoidBetAutomationInfoRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateVoidBetAutomationServiceInfo(UpdateVoidBetAutomationInfoRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> GetAutoVoidRequestQueue(GetAutoVoidRequestQueueRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateAutoVoidRequestQueue(UpdateAutoVoidRequestQueueRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> GetTicketVoidingQueue(GetTicketVoidingQueueRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateTicketVoidingQueue(UpdateTicketVoidingQueueRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> GetVoidingHistory(GetVoidingHistoryRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateVoidingHistory(UpdateVoidingHistoryRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> GetLetstalk(GetLetstalkRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateLetstalk(UpdateLetstalkRequest request)
    {
        var model = await mediator.Send(request);
        return Ok(model);
    }
}