using System;
using System.Threading.Tasks;
using Fanex.Caching;
using Fanex.Data;
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
    private readonly ICache cache;

    public HomeController(IMaintenanceService maintenanceService, ICache cache)
    {
        this.maintenanceService = maintenanceService;
        this.cache = cache;
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
    public async Task<IActionResult> RedisHealthCheck()
    {
        var cachePolicy = new CacheItemOptions().SetSlidingExpiration(TimeSpan.FromHours(1));
        await cache.SetAsync("RedisHealthCheck", DateTimeOffset.Now.ToString(), cachePolicy);

        return Ok("OK");
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<UnderMaintenanceTime>> Um()
    {
        var underMaintenanceInfo = await maintenanceService.GetUnderMaintenanceTimeAsync();

        return underMaintenanceInfo;
    }

    [AllowAnonymous]
    [HttpGet]
    [SkipUMFilter]
    public async Task<IActionResult> ClearCache()
    {
        var result = await CacheManager.ClearCacheAsync();

        return Ok(result);
    }
}