using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEbook.UM.AspNetCore.Filters;
using ONEbook.UM.Models;
using ONEbook.UM.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

[SkipLogging]
public class HomeController : Controller
{
    private readonly IMaintenanceService maintenanceService;

    public HomeController(IMaintenanceService maintenanceService)
    {
        this.maintenanceService = maintenanceService;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View("~/wwwroot/dist/home-page/index.cshtml");
    }

    [AllowAnonymous]
    [HttpHead]
    [SkipUMFilter]
    [ActionName("Index")]
    public IActionResult IndexHead()
    {
        return Ok("200-Ok");
    }

    [AllowAnonymous]
    public IActionResult About()
    {
        return View();
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<UnderMaintenanceTime>> Um()
    {
        var underMaintenanceInfo = await maintenanceService.GetUnderMaintenanceTimeAsync();

        return underMaintenanceInfo;
    }
}