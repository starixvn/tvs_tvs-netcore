using System.Text.Json;
using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequestFromOtherSites;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Controllers;

[Route("[controller]/[action]")]
public class AddRequestFromOtherSitesController(IMediator mediator) : Controller
{
    [HttpGet]
    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet, Policy = Constant.Policy.Read)]
    public async Task<ActionResult> CTS()
    {
        var requestJson = TempData["AddRequestFromCTS"] as string;
        if (!string.IsNullOrWhiteSpace(requestJson))
        {
            var request = JsonSerializer.Deserialize<AddRequestFromCTSRequest>(requestJson);
            ViewBag.AddRequestIndexViewModel = await mediator.Send(request);
        }

        return View("~/wwwroot/dist/ticket-voiding-system/add-request/index.cshtml");
    }
}