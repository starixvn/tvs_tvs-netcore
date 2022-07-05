using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.Website.Controllers
{
    [SkipLogging]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("~/wwwroot/dist/home-page/index.cshtml");
        }

        [AllowAnonymous]
        public IActionResult About()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult HealthCheck()
        {
            return Ok("200-Ok");
        }
    }
}