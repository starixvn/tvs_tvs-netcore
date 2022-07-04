using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Core.Web;

namespace TicketVoidingSystem.Website.Controllers
{
    [AllowAnonymous]
    [SkipLogging]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}