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

        stringBuilder.Append($"GC.GetTotalMemory(false): {GC.GetTotalMemory(false):n0}\n");
        stringBuilder.Append($"VirtualMemorySize64 is: {currentProcess.VirtualMemorySize64:n0}\n");
        stringBuilder.Append($"PrivateMemorySize64 is: {currentProcess.PrivateMemorySize64:n0}\n");
        stringBuilder.Append($"WorkingSet64 is: {currentProcess.WorkingSet64:n0}\n");
        stringBuilder.Append($"PagedMemorySize64 is: {currentProcess.PagedMemorySize64:n0}\n");
        stringBuilder.Append($"NonpagedSystemMemorySize64 is: {currentProcess.NonpagedSystemMemorySize64:n0}\n");
        stringBuilder.Append($"NonpagedSystemMemorySize64 is: {currentProcess.NonpagedSystemMemorySize64:n0}\n");
        stringBuilder.AppendLine($@"Threads.Count: {currentProcess.Threads.Count}");
        stringBuilder.AppendLine($@"ThreadPool.PendingWorkItemCount: {ThreadPool.PendingWorkItemCount}");

        return stringBuilder.ToString();
    }

}