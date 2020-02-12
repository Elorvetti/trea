using System.Linq;
using System.Diagnostics;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TreA.Presentation.Models;
using TreA.Services.Photo;
using TreA.Services.Podcast;
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
        private readonly IPodcastService _podcastService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly IHomeService _homeService;
        private readonly ISlugService _slugService;
        public HomeController(ILogger<HomeController> logger, IPhotoService photoService, IPodcastService podcastService ,ICategoryService categoryService, IArgumentService argumentService, IPostService postService, ISlugService slugService, IHomeService homeService)
        {
            _logger = logger;
            this._photoService = photoService;
            this._podcastService = podcastService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
            this._homeService = homeService;
        }

        public IActionResult Index()
        {
            var model = new HomeModel();

            //SEO 
            var homeSetting = _homeService.GetSetting();
            ViewBag.description = homeSetting.headerTesto;
   
            //Get last post
            var posts = _postService.GetLast(5);
            
            var newsletterImageId = _homeService.GetSetting().newsletterImageId;
            var newsletterBackgroundImage = _photoService.GetById(newsletterImageId).path;
            model.Newsletter.backgroundImage = newsletterBackgroundImage;
          
            foreach(var post in posts){
                model.PostDisplays.Add(new PostDisplayModel(){
                    id = post.id,
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = Regex.Replace(post.testo, "<.*?>", string.Empty).Substring(0, 200)
                });
           }

            var podcasts = _podcastService.GetAll();
            foreach(var podcast in podcasts){
                model.podcasts.Add(new PodcastModel(){
                    id = podcast.id,
                    name = podcast.name,
                    description = podcast.description,
                    path = podcast.path
                });
            }

            return View(model);
        }
        
        [HttpPost]
        public HomeModel GetAllCategory(){
            var model = new HomeModel();
            
            var categories = _categoryService.GetAll();
            foreach(var category in categories){
                model.categoryMenus.Add(new CategoryMenu(){
                    id = category.id,
                    name = category.name,
                    HasChild = _argumentService.GetByCategoryId(category.id).Any() ? true : false,
                    slug = _slugService.GetById(category.slugId).name
                });
            }

            return model;
        }

        [HttpPost]
        public HomeModel GetArgument(int categoryId, int livello = 1, int idPadre = 0){
            var model = new HomeModel();

            var arguments = _argumentService.GetByCategoryId(categoryId, livello, idPadre);
            foreach(var argument in arguments){               
                model.argumentMenus.Add(new ArgumentMenu(){
                    id = argument.id,
                    name = argument.name,
                    categoryId = categoryId,
                    Child = _argumentService.GetByCategoryId(categoryId, 2, argument.id),
                    slug = _slugService.GetById(argument.slugId).name
                });
            }
            
            return model;
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
