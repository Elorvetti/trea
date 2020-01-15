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
using TreA.Data;
using TreA.Services.Album;
using TreA.Services.Argument;
using TreA.Services.Category;
using TreA.Services.Common;
using TreA.Services.Files;
using TreA.Services.Folder;
using TreA.Services.Home;
using TreA.Services.Login;
using TreA.Services.Photo;
using TreA.Services.Podcast;
using TreA.Services.Post;
using TreA.Services.User;
using TreA.Services.Video;
using TreA.Services.Slug;

namespace TreA.Presentation
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
                o.LoginPath = "/Backoffice/Login/Index";
                o.AccessDeniedPath = "/Backoffice/Login/Index";
            });

            //Custom services
            services.AddScoped<ICommonService, CommonService>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IArgumentService, ArgumentService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IVideoService, VideoService>();
            services.AddScoped<IAlbumService, AlbumService>();
            services.AddScoped<IPodcastService, PodcastService>();
            services.AddScoped<IFolderService, FolderService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ISlugService, SlugService>();
            services.AddScoped<IHomeService, HomeService>();

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
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"App_Data")),
                RequestPath = new PathString("/App_Data")
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Areas/Backoffice/wwwroot")),
                RequestPath = new PathString("/adminroot")
            });

            app.UseCookiePolicy();

            app.UseAuthentication();
            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "areas",
                    template: "{area:exists}/{controller=User}/{action=Index}/{id?}"
                );

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}"
                );
            });
            
        }
    }
}
