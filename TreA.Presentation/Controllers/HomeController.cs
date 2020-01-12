using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TreA.Data.Entities;
using TreA.Presentation.Models;
using TreA.Services.Photo;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Home;

namespace TreA.Presentation.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IPhotoService _photoService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly IHomeService _homeService;

        public HomeController(ILogger<HomeController> logger, IPhotoService photoService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService, IHomeService homeService)
        {
            _logger = logger;
            this._photoService = photoService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._homeService = homeService;
        }

        public IActionResult Index()
        {
            var model = new HomeModel();
            model.Newsletter = new NewsletterModel();
            model.PostDisplays = new List<PostDisplayModel>();

            //Get last post
            var posts = _postService.GetLast(4);
            
            var newsletterImageId = _homeService.GetSetting().newsletterImageId;
            var newsletterBackgroundImage = _photoService.GetById(newsletterImageId).path;
            model.Newsletter.backgroundImage = newsletterBackgroundImage;
          
            foreach(var post in posts){
                model.PostDisplays.Add(new PostDisplayModel(){
                    id = post.id,
                    slug = post.slug,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = post.testo
                });
           }
            return View(model);
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

        public HomeModel GetHeader(){
            var model = new HomeModel();
            var home = _homeService.GetSetting();
            
            model.headerBackgroundImage =_photoService.GetById(home.headerImageId).path;
            model.headerTitolo = home.headerTitolo;
            model.headerTesto = home.headerTesto;
            
            return model;
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
