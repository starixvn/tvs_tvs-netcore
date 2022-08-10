using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ABExceptionList.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ABExceptionListController : ControllerBase
    {
        private readonly IMediator mediator;

        public ABExceptionListController(IMediator mediator)
        {
            this.mediator = mediator;
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
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPermission()
        {
            var model = await mediator.Send(new GetPermissionRequest());
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubType()
        {
            var model = await mediator.Send(new GetSubTypeRequest());
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSites()
        {
            var model = await mediator.Send(new GetSitesRequest());
            return Ok(model);
        }
    }
}