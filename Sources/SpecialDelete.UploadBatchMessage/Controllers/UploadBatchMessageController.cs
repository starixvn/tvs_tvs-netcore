using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.UploadBatchMessage.Handlers;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Web;

namespace SpecialDelete.UploadBatchMessage.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class UploadBatchMessageController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts() => this.JsonResultPascalCase(await mediator.Send(new GetProductRequest()));

    [HttpPost]
    public async Task<IActionResult> CheckTransIds(CheckTransIdsRequest request) => this.JsonResultPascalCase(await mediator.Send(request));

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.UploadBatchMsg, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<IActionResult> UpdateMessage(UpdateMessageRequest request) => this.JsonResultPascalCase(await mediator.Send(request));
}