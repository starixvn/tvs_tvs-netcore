using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.ABExceptionList.Controllers
{
    [Route("TicketVoidingSystem/[controller]")]
    public class ABExceptionListController : Controller
    {
        private readonly IMediator mediator;

        public ABExceptionListController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("")]
        [Route("[action]")]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public IActionResult Index()
        {
            return View("~/wwwroot/dist/ab-exception-list/index.cshtml");
        }

        [HttpGet]
        [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.ABExceptionList, Policy = Constant.Policy.Read)]
        public async Task<IActionResult> GetPermission()
        {
            var request = new GetPermissionRequest();
            var model = await mediator.Send(request);
            return Ok(model);
        }
    }
}