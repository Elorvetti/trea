using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using TreA.Presentation.Areas.Backoffice.Models;
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
        public HomeModel GetCategory(){
            var model = new HomeModel();
            
            var categories = _categoryService.GetAll();
            foreach(var category in categories){
                model.categoryMenus.Add(new CategoryMenu(){
                    id = category.id,
                    name = category.name,
                    HasChild = _argumentService.GetByCategoryId(category.id).Any() ? true : false,
                });
            }

            return model;
        }

        [HttpPost]
        public HomeModel GetArgument(int categoryId, int livello = 1, int IdPadre = 0){
            var model = new HomeModel();

            var arguments = _argumentService.GetByCategoryId(categoryId, livello, IdPadre);
            foreach(var argument in arguments){
                model.argumentMenus.Add(new ArgumentMenu(){
                    id = argument.id,
                    name = argument.name,
                    categoryId = categoryId,
                    Child = _argumentService.GetByCategoryId(categoryId, 2, argument.id)
                });
            }

            return model;
        }
    }
}