using Fanex.Caching.Redis;
using Fanex.Data;
using Fanex.Logging.Sentry.RavenClient;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Attributes;
using Fanex.SiteDbConnectionManager.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ONEbook.UM.DependencyInjection;
using ONEbook.UM.Filters;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using TicketVoidingSystem.Web;
using TicketVoidingSystem.Web.JsonConverter;
using TicketVoidingSystem.Website.Utilities;
using TicketVoidingSystem.Website.Utilities.WebOptimizer;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

// Add services to the container.
services.AddTvsAppSetting(configuration);
services.AddRazorPages();
services.AddTvsAuthentication();
services.AddHttpClient<AmendmentOicHttpClientService, AmendmentOicHttpClientServiceImp>();
services.AddHttpClient<CashOutHttpClientService, CashOutHttpClientServiceImp>();
services.AddHttpClient<LinkedLogHttpClientService, LinkedLogHttpClientServiceImp>();
services.AddHttpClient<OWPHttpClientService, OWPHttpClientServiceImp>();
services.AddFanexData(configuration);
services.AddExceptionHandler();
services.AddFanexLogSentry(configuration);
services.AddRemotingRef();
services.AddNapClient(configuration);
services.AddOneBookUmForWeb(configuration);
services.AddHealthChecks();
services.AddLetstalk();
services.AddCoreServices(configuration);
services.AddBusinessServices();
services.AddRedisCache(configuration.GetSection("FanexCachingRedis"));
services.AddFanexMailService();
services.AddMediatR();
services.AddAutoMapper();
services.AddTvsSignalR();
services.AddTvsSiteDbStatus();
services.AddHttpContextAccessor();
services.AddResponseCompression(options => { options.MimeTypes = ["text/html", "text/css", "application/javascript", "application/json"]; });
services.AddRazorPages();
services.AddControllersWithViews(options =>
{
    options.Filters.Add(new SessionAuthorizeAttribute());
    options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)) { Order = 0 });
    options.Filters.Add(new ServiceFilterAttribute(typeof(LogActionFilterAttribute)) { Order = 1 });
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new CustomDateTimeJsonConverter());
    options.JsonSerializerOptions.Converters.Add(new CustomIntJsonConverter());
    options.JsonSerializerOptions.Converters.Add(new CustomDecimalJsonConverter());
}).AddSessionStateTempDataProvider();

services.AddWebOptimizer();
services.AddSiteDbConnectionManager();

// Build app
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseResponseCompression();
app.UseWebOptimizer();
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapHealthChecks("/healthz");
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapHub<NotificationHub>("/SignalR/NotificationHub");
app.UseHttpContextAccessor();

await app.RunAsync();