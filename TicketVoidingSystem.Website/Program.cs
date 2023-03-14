using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Signin.AspNetCore.Attribute;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ONEbook.UM.AspNetCore.Filters;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using TicketVoidingSystem.Web;
using TicketVoidingSystem.Web.JsonConverter;
using TicketVoidingSystem.Website.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.LoadAppSetting(builder.Configuration);
builder.Services.AddRazorPages();
builder.Services.RegisterAuthentication();
builder.Services.AddHttpClient<AmendmentOicHttpClientService, AmendmentOicHttpClientServiceImp>();
builder.Services.AddHttpClient<CashOutHttpClientService, CashOutHttpClientServiceImp>();
builder.Services.RegisterFanexData(builder.Configuration);
builder.Services.RegisterFanexExceptionHandler();
builder.Services.RegisterSentry();
builder.Services.RegisterONEbookUM(builder.Configuration);
builder.Services.RegisterRemotingRef();
builder.Services.RegisterLetstalk();
builder.Services.RegisterCoreServices(builder.Configuration);
builder.Services.RegisterBusinessServices();
builder.Services.RegisterFanexCaching(builder.Configuration);
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

// Build app
var app = builder.Build();

void WriteLogWhenApplicationIsStopping(object title)
{
    Console.WriteLine(title);

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

    Console.WriteLine(stringBuilder.ToString());
}
app.Lifetime.ApplicationStopping.Register(WriteLogWhenApplicationIsStopping, @"ApplicationStopping was called");
app.Lifetime.ApplicationStopped.Register(WriteLogWhenApplicationIsStopping, @"ApplicationStopped was called");

app.Use((context, next) =>
{
    context.Request.PathBase = new PathString(app.Configuration.GetSection("PathBase").Value);
    return next();
});
app.UseDeveloperExceptionPage();
app.UseResponseCompression();
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

#if DEBUG
app.Run();
#else
await app.RunAsync("http://0.0.0.0:5000");
#endif