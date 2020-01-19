﻿using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TreA.Presentation.Models;
using TreA.Services.Photo;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Home;
using TreA.Services.Slug;

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
        private readonly ISlugService _slugService;
        public HomeController(ILogger<HomeController> logger, IPhotoService photoService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService, ISlugService slugService, IHomeService homeService)
        {
            _logger = logger;
            this._photoService = photoService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
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
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = post.testo
                });
           }
            return View(model);
        }

        [HttpPost]
        public IList<CategoryModel> GetAllCategory(){
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
                        slug = _slugService.GetById(argument.slugId).name
                    });
                }
                
                model.Add(new CategoryModel(){
                    id = category.id,
                    name = category.name,
                    slug = _slugService.GetById(category.slugId).name,
                    Children = children
                });
            }
            
            return model;
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
                    slug = _slugService.GetById(argument.slugId).name,
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
