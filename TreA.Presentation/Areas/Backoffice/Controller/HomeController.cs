using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using TreA.Presentation.Areas.Backoffice.Models;
using TreA.Data.Entities;
using TreA.Services.Photo;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Home;
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class HomeController : Controller{

        private readonly IPhotoService _photoService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly IHomeService _homeService;
        private readonly ISlugService _slugService;
        public HomeController(ICategoryService categoryService, IArgumentService argumentService, IPostService postService, IHomeService homeService, IPhotoService photoService, ISlugService slugService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._homeService = homeService;
            this._photoService = photoService;
            this._slugService = slugService;
        }

        public IActionResult Index(){
            ViewBag.Title = "Home Page";

            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection home){
            var model = new HomeModel();

            model.headerTitolo = home["titleHeader"];
            model.headerTesto = home["testoHeader"];
            model.headerImageId = Convert.ToInt32(home["idHeaderImage"]);
            model.newsletterImageId = Convert.ToInt32(home["idNewsletterImage"]);
            
            _homeService.Insert(model);
            
            return View();
        }

        public HomeModel GetSetting(){
            var model = new HomeModel();

            var homeSetting = _homeService.GetSetting();
            model.headerTitolo = homeSetting.headerTitolo;
            model.headerTesto = homeSetting.headerTesto;
            model.headerImageId = homeSetting.headerImageId;
            model.headerBackgroundImage = _photoService.GetById(homeSetting.headerImageId).path;
            model.newsletterImageId = homeSetting.newsletterImageId;
            model.newsletterBackgroundImage = _photoService.GetById(homeSetting.newsletterImageId).path;

            return model;
        }

        public void Update(IFormCollection home){
            var model = new HomeModel();

            model.headerTitolo = home["titleHeader"];
            model.headerTesto = home["testoHeader"];
            model.headerImageId = Convert.ToInt32(home["idHeaderImage"]);
            model.newsletterImageId = Convert.ToInt32(home["idNewsletterImage"]);

            _homeService.Update(model);
        }

        [HttpPost]
        public IList<CategoryModel> GetMenu(){
             var model = new List<CategoryModel>();
            
            var categories = _categoryService.GetAll();
            foreach(var category in categories){
                
                //Get argument of this category
                var children = new List<ArgumentChild>();
                var arguments = _argumentService.GetByCategoryId(category.id);
                foreach(var argument in arguments){
                    children.Add(new ArgumentChild(){
                        id = argument.id,
                        name = argument.name,
                    });
                }

                if(arguments.Count == 0){
                    var posts = _postService.GetByCategoryId(category.id);
                    foreach(var post in posts){
                        children.Add(new ArgumentChild(){
                            id = post.id,
                            name = post.title,
                        });
                    }
                }
                
                model.Add(new CategoryModel(){
                    id = category.id,
                    name = category.name,
                    Children = children
                });
            }
            
            return model;
        }
    }
}