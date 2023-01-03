using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.MarkTickets.Handlers;
using TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;
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
        public async Task<IActionResult> ExportExcel(ExportExcelRequest request)
        {
            var model = await mediator.Send(request);
            return File(model.Content, ExcelFileModel.ContentType, model.FileName);
        }

        [HttpPost]
        public async Task<IActionResult> ExportExcelDetailTicket(ExportExcelDetailTicketsRequest request)
        {
            var model = await mediator.Send(request).ConfigureAwait(false);
            return File(model.Content, ExcelFileModel.ContentType, model.FileName);
        }

        [HttpPost]
        public async Task<IActionResult> GetUserLogs(GetUserLogsRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkRequest request) => Ok(await mediator.Send(request));

        [HttpPost]
        public async Task<IActionResult> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkRequest request) => Ok(await mediator.Send(request));

        [HttpGet]
        public async Task<IActionResult> GetDataPermission(GetDataPermissionRequest request) => Ok(await mediator.Send(request));
    }
}