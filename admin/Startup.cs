using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.SqlServer;
using admin.Models;
using admin.Data;
using admin.Services;

namespace admin
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
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddDbContext<TreAContext>( o => {
                o.UseSqlServer(Configuration.GetConnectionString("TreADatabase"));
            });
            
            //Identity user services
            services.AddIdentity<IdentityUser, IdentityRole>(o => {
                o.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<TreAContext>();
                
            services.ConfigureApplicationCookie(o => {
                o.Cookie.HttpOnly = true;
                o.LoginPath = "/Login/Index";
                o.AccessDeniedPath = "/Login/Index";
            });

            //Custom services
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IArgumentService, ArgumentService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IVideoService, VideoService>();
            services.AddScoped<IPodcastService, PodcastService>();
            services.AddScoped<IFolderService, FolderService>();
            services.AddScoped<IFileService, FileService>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.Configure<FormOptions>(options => {
                options.MultipartBodyLengthLimit = 309715200;
            });

        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider( Path.Combine(Directory.GetCurrentDirectory(), @"App_Data")),
                RequestPath = new PathString("/App_Data")
            });
            app.UseCookiePolicy();

            app.UseAuthentication();
            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "User",
                    template: "{Controller=User}/{action=Index}/{id?}"
                );
                
                routes.MapRoute(
                    name: "Login",
                    template: "{controller=Login}/{action=Index}/{id?}");

            });
        }
    }
}
