using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using TreA.Data.Entities;
using TreA.Presentation.Models;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Album;
using TreA.Services.Photo;
using TreA.Services.Video;
using TreA.Services.Slug;
using TreA.Services.Review;

namespace TreA.Presentation.Controllers
{
    public class PostController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly IAlbumService _albumService;
        private readonly IPhotoService _photoService;
        private readonly IVideoService _videoService;
        private readonly ISlugService _slugService;
        private readonly IReviewService _reviewService;

        public PostController(ICategoryService categoryService, IArgumentService argumentService, IPostService postService, IAlbumService albumService, IPhotoService photoService, IVideoService videoService, ISlugService slugService, IReviewService reviewService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._albumService = albumService;
            this._photoService = photoService;
            this._videoService = videoService;
            this._slugService = slugService;
            this._reviewService = reviewService;
        }

        public IActionResult All(int pageSize, int pageNumber){      
            var model = new PostModel();

            //SEO 
            ViewBag.description = "Tutti i Post disponibili";

            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total =_postService.GetAll().Count;

            model.sectionName = "Lista Post";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.posts = _postService.GetAll();

            foreach(var post in model.posts){
                model.postsDisplay.Add(new PostDisplayModel(){
                    id = post.id,
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title
                });
            }

            return View(model);
        }

        public IActionResult List(int argumentId, int pageSize, int pageNumber){      
            var model = new PostModel();

            //SEO 
            ViewBag.description = _argumentService.GetById(argumentId).description;

            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total =_postService.GetByArgumentId(argumentId).Count;

            model.sectionName = _argumentService.GetById(argumentId).name;
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.posts = _postService.GetByArgumentId(argumentId);

            //BreadCrumb
            model.categoryName = _categoryService.GetById(_argumentService.GetById(argumentId).categoryId).name;
            model.argumentName = _argumentService.GetById(argumentId).name;
            model.breadcrumb = string.Concat(model.categoryName, " > ", model.argumentName);

            foreach(var post in model.posts){
                model.postsDisplay.Add(new PostDisplayModel(){
                    id = post.id,
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = Regex.Replace(post.testo, "<.*?>", string.Empty).Substring(0, 200)
                    
                });
            }

            return View(model);
        }
        
        public IActionResult GetByPostId(string id){
            var model = new PostModel();

            //Convert slugId to Int and Find Post
            var postId = Convert.ToInt32(id);
            var post = _postService.GetById(postId);
            
            //BreadCrumb
            model.categoryName = _categoryService.GetById(post.categoryId).name;
            var argument = _argumentService.GetById(post.argumentId);
            if(argument != null){
                model.argumentName = argument.name;
                model.breadcrumb = string.Concat(model.categoryName, " > ", model.argumentName, " > ", post.title);
            } else {
                model.breadcrumb = string.Concat(model.categoryName, " > ", post.title);
            }
            
            //SEO
            ViewBag.description = Regex.Replace(post.testo, "<.*?>", string.Empty).Substring(0, 255);

            //Post data
            model.id = post.id;
             model.coverImage = _photoService.GetById(post.PhotoId).path;
            model.title = post.title;
            model.subtitle = post.subtitle;
            model.testo = post.testo;
            model.albumId = post.albumId;
            
            ViewBag.title = post.title;
            ViewBag.subtitle = post.subtitle;
            

            //Related Post
            var realtedPosts = _postService.GetByCategoryId(post.categoryId);
            foreach(var relatedPost in realtedPosts){
                model.realtedPost.Add(new ArgumentDisplay(){
                    id = relatedPost.id,
                    title = relatedPost.title,
                    subtitle = relatedPost.subtitle,
                    slug = _slugService.GetById(relatedPost.slugId).name
                });
            }

            var relatedArguments = _argumentService.GetByCategoryId(post.categoryId);
            foreach(var relatedArgument in relatedArguments){
                model.realtedArgument.Add(new ArgumentDisplay(){
                    id = relatedArgument.id,
                    title = relatedArgument.name,
                    nOfElement = _postService.GetByArgumentId(relatedArgument.id).Count,
                    slug = _slugService.GetById(relatedArgument.slugId).name,
                });
            }
            
            return View("GetById", model);
        }

        [HttpPost]
        public IList<PostDisplayModel> Search(string id){
            var model = new List<PostDisplayModel>();
            var posts = _postService.Search(id);
          
            foreach(var post in posts){
                model.Add(new PostDisplayModel(){
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = post.testo
                });     
            }

            return model;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddReview(int Id, IFormCollection data){
            var model = new Reviews();
            
            model.postId = Convert.ToInt32(data["postId"]);
            model.nome = data["name"];
            model.email = data["email"];
            model.titolo = data["title"];
            model.testo = data["review"];
            model.acepted = false;
            model.insertDate = DateTime.Now;
            
            if(ModelState.IsValid){
                _reviewService.Insert(model);
                return Json("OK");
            }

            return Json("Error");
        }

    }
}