using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Handlers.UserLogs;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [AllowAnonymous]
    public class MarkTicketsController : ControllerBase
    {
        private readonly IMediator mediator;

        public MarkTicketsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        //public async Task<ActionResult> Index()
        //{
        //    var viewModel = await mediator.Send(new IndexRequest()).ConfigureAwait(false);
        //    viewModel.Root = Url.Content("~");
        //    return View("~/dist/mark-tickets/index.cshtml", viewModel);
        //}

        [HttpPost]
        public async Task<IActionResult> GetTickets(GetTicketsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> GetDetailTickets(GetDetailTicketsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> GetAllMarkedTickets(AllMarkedTicketsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> MarkTickets(MarkTicketsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> MarkAllTickets(MarkAllTicketsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<ActionResult> ExportExcel(ExportExcelRequest request)
        {
            var model = await mediator.Send(request);
            return File(model.Content, ExcelFileModel.ContentType, model.FileName);
        }

        [HttpPost]
        public async Task<ActionResult> ExportExcelDetailTicket(ExportExcelDetailTicketsRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return File(model.Content, ExcelFileModel.ContentType, model.FileName);
        }

        [HttpPost]
        public async Task<JsonResult> GetUserLogs(GetUserLogsRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return this.JsonNet(model);
        }

        [HttpPost]
        public async Task<JsonResult> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return this.JsonNet(model);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return this.JsonNet(model);
        }

        [HttpGet]
        public async Task<JsonResult> GetDataPermission(GetDataPermissionRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return this.JsonNet(model);
        }
    }
}