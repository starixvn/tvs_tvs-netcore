using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Signin.AspNetCore.Attribute;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ONEbook.UM.AspNetCore.Filters;
using TicketVoidingSystem.Core.SignalR;
using TicketVoidingSystem.Core.Web;
using TicketVoidingSystem.Website.Utility;

namespace TicketVoidingSystem.Website
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.RegisterAuthentication(Configuration);
            services.RegisterFanexData(Configuration);
            services.RegisterFanexExceptionHandler();
            services.RegisterSentry(Configuration);
            services.RegisterONEbookUM(Configuration);
            services.RegisterCoreServices(Configuration);
            services.RegisterBusinessServices();
            services.RegisterMediatR();
            services.RegisterSignalR(Configuration);

            services.AddResponseCompression(options => { options.MimeTypes = new[] { "text/html", "text/css", "application/javascript", "application/json" }; });
            services.Configure<KestrelServerOptions>(options => { options.AllowSynchronousIO = true; });
            services.Configure<IISServerOptions>(options => { options.AllowSynchronousIO = true; });
            services.AddRazorPages();
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)));
                options.Filters.Add(new SessionAuthorizeAttribute());
                options.Filters.Add(new ServiceFilterAttribute(typeof(LogActionFilterAttribute)));
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new CustomDateTimeConverter());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use((context, next) =>
            {
                context.Request.PathBase = new PathString(Configuration.GetSection("PathBase").Value);
                return next();
            });
            app.UseDeveloperExceptionPage();
            app.UseResponseCompression();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseSession();
            app.UseMiddleware<ExceptionHandlerMiddleware>();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            NapClientManager
                .UseConfig(app.ApplicationServices.GetService<INapSettings>())
                .UseSession(app.ApplicationServices.GetService<INapSession>());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapHub<NotificationHub>("/SignalR/NotificationHub");
            });
        }
    }
}