using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Signin.AspNetCore.Attribute;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using NUglify.Css;
using NUglify.JavaScript;
using ONEbook.UM.AspNetCore.Filters;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Services;
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

builder.Services.AddWebOptimizer(pipeline =>
{
    pipeline.CompileLessFiles("/old-page/upload-batch-message/batch-message.less");

    var cssSetting = new CssSettings { OutputMode = NUglify.OutputMode.MultipleLines, CommentMode = CssComment.None };
    var codeSetting = new CodeSettings { MinifyCode = false };

    //// style bundle
    pipeline.AddCssBundle("/old-page/bundle-libs.css", cssSetting,
        "old-page/content/jquery-ui/jquery-ui-1.9.1.custom.min.css",
                        "old-page/content/jquery-ui/chosen.jquery.css",
                        "old-page/scripts/_libs/fanexgrid/fanex.grid.css",
                        "old-page/scripts/_libs/fanexgrid/fanex.pagination.css",
                        "old-page/scripts/_Libs/Validation/validationEngine.jquery.css",
                        "old-page/Content/BetList.css",
                        "old-page/Content/bullfighting.css",
                        "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.css",
                        "old-page/Scripts/_Libs/TimePicker/jquery-ui-timepicker-addon.css",
                        "old-page/Scripts/_Libs/FanexMultipleSelect/fanex.multiSelect.css",
                        "old-page/Scripts/_Libs/ContextMenu/jquery.contextMenu.css",
                        "old-page/Scripts/_Libs/toastr/toastr.css");

    //// script bundle
    pipeline.AddJavaScriptBundle("/old-page/bundle-libs-script.js", codeSetting,
                        "old-page/Scripts/_Libs/jQuery/jquery-1.8.2.js",
                        "old-page/Scripts/_Libs/jQuery/jquery-ui-1.9.1.js",
                        "old-page/Scripts/_Libs/jQuery/jquery.formattyping.js",
                        "old-page/Scripts/_Libs/jQuery/chosen.jquery.js",
                        "old-page/Scripts/_Libs/jQuery/jquery.validate.js",
                        "old-page/Scripts/_Libs/jQuery/jquery.validate.unobtrusive.js",
                        "old-page/Scripts/_Libs/Bootstrap/bootstrap-alert.js",
                        "old-page/Scripts/_Libs/Bootstrap/bootstrap-tooltip.js",
                        "old-page/Scripts/_Libs/Bootstrap/bootstrap-dropdown.js",
                        "old-page/Scripts/_Libs/BlockUI/jquery.blockUI.1.33.js",
                        "old-page/Scripts/_Libs/FanexMultipleSelect/fanex.multiSelect.js",
                        "old-page/Scripts/_Libs/FanexGrid/Fanex.Grid.js",
                        "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.js",
                        "old-page/Scripts/_Libs/FormatLibs/NumberFormat/numeral.js",
                        "old-page/Scripts/NapTicketControl.js",
                        "old-page/Scripts/NapTicketControl.Helper.js",
                        "old-page/Scripts/Languages.js",
                        "old-page/Scripts/_Libs/ContextMenu/jquery.contextMenu.js",
                        "old-page/Scripts/_Libs/Validation/jquery.validationEngine-en.js",
                        "old-page/Scripts/_Libs/Validation/jquery.validationEngine.js",
                        "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.js",
                        "old-page/Scripts/_Libs/Utils/date.format.js",
                        "old-page/Scripts/Languages/messages.js");

    pipeline.AddJavaScriptBundle("/old-page/bundle-upload-batch-message.js", codeSetting,
                        "old-page/Scripts/_Libs/Utils/stdlib.js",
                        "old-page/Scripts/Common/Message.Helper.js",
                        "old-page/Scripts/Common/Message.Validator.js",
                        "old-page/Scripts/_Libs/AngularJS/Angular-1.2.29.js",
                        "old-page/upload-batch-message/angular-v1/app.js",
                        "old-page/upload-batch-message/angular-v1/upload-batch-message/app.js",
                        "old-page/upload-batch-message/angular-v1/upload-batch-message/upload-batch-message.js");
});

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