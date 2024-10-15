using System;
using System.Diagnostics;
using System.Runtime;
using System.Text;
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
    public IActionResult Gc()
    {
        const int megabyte = 1024 * 1024;
        var stringBuilder = new StringBuilder();
        var sw = Stopwatch.StartNew();
        sw.Start();

        using var currentProcess = Process.GetCurrentProcess();
        currentProcess.Refresh();
        var memory = currentProcess.WorkingSet64 / megabyte;

        stringBuilder.AppendFormat("Total memory - Before GC.Collect: {0} Mb", memory);

        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
        GC.Collect(GC.MaxGeneration, GCCollectionMode.Aggressive | GCCollectionMode.Forced, true, true); // NOSONAR
        GC.WaitForPendingFinalizers();
        GC.WaitForFullGCComplete();

        currentProcess.Refresh();
        memory = currentProcess.WorkingSet64 / megabyte;

        var duration = sw.ElapsedMilliseconds;
        stringBuilder.AppendFormat("GC.Collected. Usage memory = {0}. Duration: {1} milliseconds", memory, duration);

        return Ok(stringBuilder.ToString());
    }

    [AllowAnonymous]
    [HttpGet]
    [SkipUMFilter]
    public async Task<IActionResult> ClearCache(int count = 10)
    {
        var result = await CacheManager.ClearCache(count);

        return Ok(result);
    }
}