using System;
using System.Threading.Tasks;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Signin.AspNetCore.Attribute;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ONEbook.UM.AspNetCore.Filters;
using TicketVoidingSystem.Website.Extensions;

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
            services.RegisterCoreServices(Configuration);
            services.RegisterONEbookUM(Configuration);
            services.RegisterBusinessServices();
            services.RegisterMediatR();
            // services.RegisterSentry(Configuration);
            services.AddResponseCompression(options =>
            {
                options.MimeTypes = new[]{
                    "text/html",
                    "text/css",
                    "application/javascript",
                    "application/json",
                };
            });
            services.AddRazorPages();
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)));
                options.Filters.Add(new SessionAuthorizeAttribute());
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new CustomDateTimeConverter());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            app.UseResponseCompression();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseSession();
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
            });
        }
    }
}