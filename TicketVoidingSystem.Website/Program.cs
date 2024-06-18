using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.SignIn.Attribute;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ONEbook.UM.AspNetCore.Filters;
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
services.LoadAppSetting(configuration);
services.AddRazorPages();
services.RegisterAuthentication();
services.AddHttpClient<AmendmentOicHttpClientService, AmendmentOicHttpClientServiceImp>();
services.AddHttpClient<CashOutHttpClientService, CashOutHttpClientServiceImp>();
services.AddHttpClient<LinkedLogHttpClientService, LinkedLogHttpClientServiceImp>();
services.RegisterFanexData(configuration);
services.RegisterFanexExceptionHandler();
services.RegisterSentry();
services.RegisterOneBookUM(configuration);
services.RegisterRemotingRef();
services.RegisterLetstalk();
services.RegisterCoreServices(configuration);
services.RegisterBusinessServices();
services.RegisterFanexCaching(configuration);
services.RegisterFanexMailService();
services.RegisterMediatR();
services.RegisterAutoMapper();
services.RegisterSignalR();
services.AddResponseCompression(options => { options.MimeTypes = new[] { "text/html", "text/css", "application/javascript", "application/json" }; });
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

services.RegisterWebOptimizer();

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
NapClientManager
    .UseConfig(app.Services.GetService<INapSettings>())
    .UseSession(app.Services.GetService<INapSession>());
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapHub<NotificationHub>("/SignalR/NotificationHub");

app.Run();