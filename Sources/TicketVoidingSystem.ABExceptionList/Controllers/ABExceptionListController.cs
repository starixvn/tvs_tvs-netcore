using System;
using Microsoft.AspNetCore.Mvc;

namespace TicketVoidingSystem.ABExceptionList.Controllers
{
    [Route("TicketVoidingSystem/[controller]")]
    public class ABExceptionListController : Controller
    {
        [Route("")]
        [Route("[action]")]
        public IActionResult Index()
        {
            return Ok($"xxxx {DateTime.Now}");
        }
    }
}