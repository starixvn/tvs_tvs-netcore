using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models;
using Fanex.NAP.Client.Models.ParameterObject;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEbook.UM.AspNetCore.Filters;
using ONEbook.UM.Models;
using ONEbook.UM.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Controllers;

using System.Runtime;
using Fanex.Caching;
using Fanex.Data;

[SkipLogging]
public class HomeController : Controller
{
    private readonly INapSession session;
    private readonly IMaintenanceService maintenanceService;
    private readonly ICache cache;

    public HomeController(INapSession session, IMaintenanceService maintenanceService, ICache cache)
    {
        this.session = session;
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
        GC.Collect(GC.MaxGeneration, GCCollectionMode.Aggressive | GCCollectionMode.Forced, true, true);
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

#if DEBUG

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> FakeLogin()
    {
        var criteria = new LoginParameter
        {
            UserId = 15470946,
            SiteId = 70,
            LoginDate = DateTime.Now,
            NetSessionId = HttpContext.Session.Id,
            Ip = "127.0.0.1",
            BrowserName = Request.Headers["User-Agent"].ToString(),
            CountryCode = "VN",
            Domain = "",
            Platform = Environment.OSVersion.Platform.ToString()
        };

        var securityService = new SecurityService();
        var onUserId = securityService.Login(criteria);

        await SaveUserSession(onUserId);

        return Content("Faked Login");
    }

    private async Task SaveUserSession(int onUserId)
    {
        const int fakeUserId = 8;
        session.UserId = fakeUserId;
        session.UserName = "sa";
        session.OnUserId = onUserId;
        var cc = "[{\"Id\":866,\"Name\":\"AB Exception List\",\"IsActive\":true,\"DisplayOrder\":5,\"Environment\":\"LIVE\",\"Url\":\"/TicketVoidingSystem/ABExceptionList/Index\",\"Policy\":2,\"FunctionName\":\"AB Exception List\",\"ParentId\":181,\"ParentName\":\"Voiding Request\",\"ValidUrl\":\"~/TicketVoidingSystem/ABExceptionList/Index\"},{\"Id\":675,\"Name\":\"Add Request\",\"IsActive\":true,\"DisplayOrder\":2,\"Environment\":\"LIVE\",\"Url\":\"/TicketVoidingSystem/AddRequest/Index\",\"Policy\":2,\"FunctionName\":\"Ticket Voiding Manage Request\",\"ParentId\":181,\"ParentName\":\"Voiding Request\",\"ValidUrl\":\"~/TicketVoidingSystem/AddRequest/Index\"},{\"Id\":587,\"Name\":\"Cancel Cash Out Action\",\"IsActive\":true,\"DisplayOrder\":0,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/CancelCashOut/Index\",\"Policy\":2,\"FunctionName\":\"Cancel Cash Out Action\",\"ParentId\":550,\"ParentName\":\"Cash Out\",\"ValidUrl\":\"~/SportBook/CancelCashOut/Index\"},{\"Id\":550,\"Name\":\"Cash Out\",\"IsActive\":true,\"DisplayOrder\":4,\"Environment\":\"LIVE\",\"Url\":\"\",\"Policy\":2,\"FunctionName\":\"Cash Out Transaction\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"/\"},{\"Id\":180,\"Name\":\"Manage Request\",\"IsActive\":true,\"DisplayOrder\":1,\"Environment\":\"LIVE\",\"Url\":\"/TicketVoidingSystem/ManageRequest/Index\",\"Policy\":2,\"FunctionName\":\"Ticket Voiding Request\",\"ParentId\":181,\"ParentName\":\"Voiding Request\",\"ValidUrl\":\"~/TicketVoidingSystem/ManageRequest/Index\"},{\"Id\":694,\"Name\":\"Mark/Unmark Tickets\",\"IsActive\":true,\"DisplayOrder\":7,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/MarkTickets/Index\",\"Policy\":2,\"FunctionName\":\"Ticket Exclusion\",\"ParentId\":170,\"ParentName\":\"SportsBook\",\"ValidUrl\":\"~/SportBook/MarkTickets/Index\"},{\"Id\":174,\"Name\":\"Number Game\",\"IsActive\":true,\"DisplayOrder\":2,\"Environment\":\"LIVE\",\"Url\":\"\",\"Policy\":2,\"FunctionName\":\"Number Game Special Delete\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"/\"},{\"Id\":179,\"Name\":\"Recover By Bet ID\",\"IsActive\":true,\"DisplayOrder\":10,\"Environment\":\"LIVE\",\"Url\":\"/Home/RecoverByBetId/Index\",\"Policy\":2,\"FunctionName\":\"Recover By Bet ID\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"~/Home/RecoverByBetId/Index\"},{\"Id\":588,\"Name\":\"Recover Cash Out Transaction\",\"IsActive\":true,\"DisplayOrder\":1,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/RecoverCashOut/Index\",\"Policy\":2,\"FunctionName\":\"Recover Cash Out Transaction\",\"ParentId\":550,\"ParentName\":\"Cash Out\",\"ValidUrl\":\"~/SportBook/RecoverCashOut/Index\"},{\"Id\":171,\"Name\":\"Recover Parlay Bet\",\"IsActive\":true,\"DisplayOrder\":6,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/RecoverParlayBet/Index\",\"Policy\":2,\"FunctionName\":\"Recover Parlay Bet\",\"ParentId\":170,\"ParentName\":\"SportsBook\",\"ValidUrl\":\"~/SportBook/RecoverParlayBet/Index\"},{\"Id\":173,\"Name\":\"Recover Sportsbook Bet\",\"IsActive\":true,\"DisplayOrder\":5,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/RecoverBet/Index\",\"Policy\":2,\"FunctionName\":\"Recover Sportsbook Bet\",\"ParentId\":170,\"ParentName\":\"SportsBook\",\"ValidUrl\":\"~/SportBook/RecoverBet/Index\"},{\"Id\":184,\"Name\":\"Recover Virtual Sports Bet\",\"IsActive\":true,\"DisplayOrder\":1,\"Environment\":\"LIVE\",\"Url\":\"/VirtualSports/RecoverVirtualSportsBet/Index\",\"Policy\":2,\"FunctionName\":\"Recover Virtual Sports Bet\",\"ParentId\":182,\"ParentName\":\"Virtual Sports\",\"ValidUrl\":\"~/VirtualSports/RecoverVirtualSportsBet/Index\"},{\"Id\":170,\"Name\":\"SportsBook\",\"IsActive\":true,\"DisplayOrder\":1,\"Environment\":\"LIVE\",\"Url\":\"\",\"Policy\":2,\"FunctionName\":\"Sportsbook Special Delete\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"/\"},{\"Id\":185,\"Name\":\"Ticket Listing\",\"IsActive\":true,\"DisplayOrder\":8,\"Environment\":\"LIVE\",\"Url\":\"/TicketListing/Index\",\"Policy\":2,\"FunctionName\":\"Ticket Listing\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"~/TicketListing/Index\"},{\"Id\":177,\"Name\":\"Upload Batch Message\",\"IsActive\":true,\"DisplayOrder\":7,\"Environment\":\"LIVE\",\"Url\":\"/UploadBatchMessage/BatchMessage/Index\",\"Policy\":2,\"FunctionName\":\"Upload Batch Msg\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"~/UploadBatchMessage/BatchMessage/Index\"},{\"Id\":182,\"Name\":\"Virtual Sports\",\"IsActive\":true,\"DisplayOrder\":6,\"Environment\":\"LIVE\",\"Url\":\"\",\"Policy\":2,\"FunctionName\":\"Virtual Sports Special Delete\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"/\"},{\"Id\":377,\"Name\":\"Void By Bet ID\",\"IsActive\":true,\"DisplayOrder\":9,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/VoidByBetID/Index\",\"Policy\":2,\"FunctionName\":\"Void By Bet ID\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"~/SportBook/VoidByBetID/Index\"},{\"Id\":540,\"Name\":\"Void By Currency\",\"IsActive\":true,\"DisplayOrder\":4,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/VoidByCurrency/Index\",\"Policy\":2,\"FunctionName\":\"Void By Currency\",\"ParentId\":170,\"ParentName\":\"SportsBook\",\"ValidUrl\":\"~/SportBook/VoidByCurrency/Index\"},{\"Id\":175,\"Name\":\"Void Number Game Bet\",\"IsActive\":true,\"DisplayOrder\":0,\"Environment\":\"LIVE\",\"Url\":\"/Gaming/NumberGame/Index\",\"Policy\":2,\"FunctionName\":\"Void Number Game Bet\",\"ParentId\":174,\"ParentName\":\"Number Game\",\"ValidUrl\":\"~/Gaming/NumberGame/Index\"},{\"Id\":183,\"Name\":\"Void Parlay Sub Bet\",\"IsActive\":true,\"DisplayOrder\":0,\"Environment\":\"LIVE\",\"Url\":\"/VirtualSports/VoidParlaySubBet/Index\",\"Policy\":2,\"FunctionName\":\"Void Parlay Sub Bet\",\"ParentId\":182,\"ParentName\":\"Virtual Sports\",\"ValidUrl\":\"~/VirtualSports/VoidParlaySubBet/Index\"},{\"Id\":186,\"Name\":\"Void Single Bet\",\"IsActive\":true,\"DisplayOrder\":0,\"Environment\":\"LIVE\",\"Url\":\"/SportBook/VoidSingleBet/Index\",\"Policy\":2,\"FunctionName\":\"Void Single Bet\",\"ParentId\":170,\"ParentName\":\"SportsBook\",\"ValidUrl\":\"~/SportBook/VoidSingleBet/Index\"},{\"Id\":181,\"Name\":\"Voiding Request\",\"IsActive\":true,\"DisplayOrder\":11,\"Environment\":\"LIVE\",\"Url\":\"\",\"Policy\":2,\"FunctionName\":\"Ticket Voiding Request\",\"ParentId\":0,\"ParentName\":\"\",\"ValidUrl\":\"/\"}]";
        session.MenuItemList = JsonSerializer.Deserialize<IList<MenuItem>>(cc);
        var claims = new List<Claim>
                        {
                            new(ClaimTypes.Name, "sa"),
                            new(ClaimTypes.NameIdentifier, "8")
                        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }

#endif
}