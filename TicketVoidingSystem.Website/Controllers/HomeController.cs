using System.Diagnostics;
using System.Text;
using System.Threading;
using System;
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


    [AllowAnonymous]
    [HttpGet]
    [SkipUMFilter]
    public string Info()
    {
        using var currentProcess = Process.GetCurrentProcess();
        var stringBuilder = new StringBuilder();

        stringBuilder.AppendFormat("GC.GetTotalMemory(false): {0:n0}\n", GC.GetTotalMemory(false));
        stringBuilder.AppendFormat("VirtualMemorySize64 is: {0:n0}\n", currentProcess.VirtualMemorySize64);
        stringBuilder.AppendFormat("PrivateMemorySize64 is: {0:n0}\n", currentProcess.PrivateMemorySize64);
        stringBuilder.AppendFormat("WorkingSet64 is: {0:n0}\n", currentProcess.WorkingSet64);
        stringBuilder.AppendFormat("PagedMemorySize64 is: {0:n0}\n", currentProcess.PagedMemorySize64);
        stringBuilder.AppendFormat("NonpagedSystemMemorySize64 is: {0:n0}\n", currentProcess.NonpagedSystemMemorySize64);
        stringBuilder.AppendFormat("NonpagedSystemMemorySize64 is: {0:n0}\n", currentProcess.NonpagedSystemMemorySize64);
        stringBuilder.AppendLine($@"Threads.Count: {currentProcess.Threads.Count}");
        stringBuilder.AppendLine($@"ThreadPool.PendingWorkItemCount: {ThreadPool.PendingWorkItemCount}");

        return stringBuilder.ToString();
    }

}