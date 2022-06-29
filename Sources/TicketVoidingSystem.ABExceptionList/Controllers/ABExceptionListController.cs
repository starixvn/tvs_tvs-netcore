using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Core.Models;
using TicketVoidingSystem.Core.SignalR;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.ABExceptionList.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ABExceptionListController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IHubContext<NotificationHub, ClientEvent> hubContext;

        public ABExceptionListController(IMediator mediator, IHubContext<NotificationHub, ClientEvent> hubContext)
        {
            this.mediator = mediator;
            this.hubContext = hubContext;
        }

        [HttpGet]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public async Task<IActionResult> GetPermission()
        {
            var model = await mediator.Send(new GetPermissionRequest());
            return Ok(model);
        }

        [HttpPost]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public async Task<IActionResult> CheckUsernames(CheckUsernamesRequest request)
        {
            var model = await mediator.Send(request);
            return Ok(model);
        }

        [HttpPost]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Host)]
        public async Task<IActionResult> AddUsers(AddUsersRequest request)
        {
            var model = await mediator.Send(request);
            return Ok(model);
        }

        [HttpPost]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Host)]
        public async Task<IActionResult> RemoveUsers(RemoveUsersRequest request)
        {
            var model = await mediator.Send(request);
            return Ok(model);
        }

        [HttpPost]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public async Task<IActionResult> GetUsers(GetUsersRequest request)
        {
            var model = await mediator.Send(request);
            await hubContext.Clients.All.showVoidResult(new List<Result>());
            return Ok(model);
        }

        [HttpGet]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public async Task<IActionResult> GetSubType()
        {
            var model = await mediator.Send(new GetSubTypeRequest());
            return Ok(model);
        }
    }
}