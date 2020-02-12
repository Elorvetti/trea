using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Rewrite;
using TreA.Services.Slug;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Album;
using TreA.Services.Photo;
using TreA.Services.Video;
using TreA.Services.Review;

namespace TreA.Presentation.Controllers
{
    public class RewriteController : Controller
    {
        private readonly ISlugService _slugService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly IAlbumService _albumService;
        private readonly IPhotoService _photoService;
        private readonly IVideoService _videoService;
        private readonly IReviewService _reviewService;
        public RewriteController(ISlugService slugService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService, IAlbumService albumService, IPhotoService photoService, IVideoService videoService, IReviewService reviewService){
            this._slugService = slugService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._albumService = albumService;
            this._photoService = photoService;
            this._videoService = videoService;
            this._reviewService = reviewService;
        }

        public IActionResult Index(){
            var request = HttpContext.Request;
            var host = request.Host;
            var slug = request.QueryString.Value.Replace("?param=", "/Blog/");
                    
            var entity = _slugService.GetByName(slug).entityname;
            var id = _slugService.GetByName(slug).id;

            if(entity == "Category"){
                var categoryId = _categoryService.GetBySlugId(id).id;
                var arguments = _argumentService.GetByCategoryId(categoryId);

                var argumentModel = new ArgumentController(_argumentService, _categoryService, _postService, _slugService, _photoService).List(categoryId, 50, 1);

                //SEO 
                ViewBag.description = _categoryService.GetById(categoryId).description;

                return View("~/Views/Argument/List.cshtml", argumentModel);

            } else if(entity == "Argument"){
                var argumentId = _argumentService.GetBySlugId(id).id;
                var posts = _postService.GetByArgumentId(argumentId);
                
                if(posts.Count == 0 || posts.Count  > 1){
                    var postListModel = new PostController(_categoryService, _argumentService, _postService, _albumService, _photoService, _videoService, _slugService, _reviewService).List(argumentId, 50, 1);
                    
                    //SEO 
                    ViewBag.description = _argumentService.GetById(argumentId).description;

                    return View("~/Views/Post/List.cshtml", postListModel);
                } else {
                    var idPost = posts[0].id;
                    var modelPost = new PostController(_categoryService, _argumentService, _postService, _albumService, _photoService, _videoService, _slugService, _reviewService).GetByPostId(idPost);
                    
                    //SEO
                    ViewBag.description = Regex.Replace(modelPost.testo, "<.*?>", string.Empty).Substring(0, 255);

                    //POST TITLE
                    ViewBag.title = modelPost.title;
                    ViewBag.subtitle = modelPost.subtitle;
                    
                    return View("~/Views/Post/GetById.cshtml", modelPost);
                }
            } 
            
            var postId = _postService.GetBySlugId(id).id;
            var postModel = new PostController(_categoryService, _argumentService, _postService, _albumService, _photoService, _videoService, _slugService, _reviewService).GetByPostId(postId);

            //SEO
            ViewBag.description = Regex.Replace(postModel.testo, "<.*?>", string.Empty).Substring(0, 255);

            //POST TITLE
            ViewBag.title = postModel.title;
            ViewBag.subtitle = postModel.subtitle;
            
            return View("~/Views/Post/GetById.cshtml", postModel);
        }
    }
}