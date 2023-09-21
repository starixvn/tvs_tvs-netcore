using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Signin.AspNetCore.Attribute;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ONEbook.UM.AspNetCore.Filters;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using TicketVoidingSystem.Web;
using TicketVoidingSystem.Web.JsonConverter;
using TicketVoidingSystem.Website.Utilities;
using TicketVoidingSystem.Website.Utilities.WebOptimizer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.LoadAppSetting(builder.Configuration);
builder.Services.AddRazorPages();
builder.Services.RegisterAuthentication();
builder.Services.AddHttpClient<AmendmentOicHttpClientService, AmendmentOicHttpClientServiceImp>();
builder.Services.AddHttpClient<CashOutHttpClientService, CashOutHttpClientServiceImp>();
builder.Services.AddHttpClient<TicketVoidingSystemHttpClientService, TicketVoidingSystemHttpClientServiceImp>();
builder.Services.AddHttpClient<LinkedLogHttpClientService, LinkedLogHttpClientServiceImp>();
builder.Services.RegisterFanexData(builder.Configuration);
builder.Services.RegisterFanexExceptionHandler();
builder.Services.RegisterSentry();
builder.Services.RegisterOneBookUM(builder.Configuration);
builder.Services.RegisterRemotingRef();
builder.Services.RegisterLetstalk();
builder.Services.RegisterCoreServices(builder.Configuration);
builder.Services.RegisterBusinessServices();
builder.Services.RegisterFanexCaching(builder.Configuration);
builder.Services.RegisterFanexMailService();
builder.Services.RegisterMediatR();
builder.Services.RegisterAutoMapper();
builder.Services.RegisterSignalR();
builder.Services.AddResponseCompression(options => { options.MimeTypes = new[] { "text/html", "text/css", "application/javascript", "application/json" }; });
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new SessionAuthorizeAttribute());
    options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)) { Order = 0 });
    options.Filters.Add(new ServiceFilterAttribute(typeof(LogActionFilterAttribute)) { Order = 1 });
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new CustomDateTimeJsonConverter());
    options.JsonSerializerOptions.Converters.Add(new CustomIntJsonConverter());
});
builder.Services.RegisterWebOptimizer();

// Build app
var app = builder.Build();

app.Use((context, next) =>
{
    context.Request.PathBase = new PathString(app.Configuration.GetSection("PathBase").Value);
    return next();
});
app.UseDeveloperExceptionPage();
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