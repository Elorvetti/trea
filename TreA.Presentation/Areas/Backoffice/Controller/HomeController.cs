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
using TreA.Services.Home;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class HomeController : Controller{

        private readonly IPhotoService _photoService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;

        private readonly IHomeService _homeService;
        public HomeController(ICategoryService categoryService, IArgumentService argumentService, IHomeService homeService, IPhotoService photoService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._homeService = homeService;
            this._photoService = photoService;
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
        public IList<Categories> GetAllCategory(){
            return _categoryService.GetAll();
        }

        [HttpPost]
        public IList<ArgumentModel> GetAllArgument(){
                        
            var models = new List<ArgumentModel>();

            var arguments = _argumentService.GetAll();
            foreach(var argument in arguments)
            {
                models.Add(new ArgumentModel()
                {
                    id = argument.id,
                    categoryId = argument.category.id,
                    slug = argument.slug,
                    name = argument.name
                });

            }

            return models;
        }
    }
}