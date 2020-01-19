using System;
using Microsoft.AspNetCore.Mvc;
using TreA.Presentation.Models;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Album;
using TreA.Services.Photo;
using TreA.Services.Video;
using TreA.Services.Slug;

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

        public PostController(ICategoryService categoryService, IArgumentService argumentService, IPostService postService, IAlbumService albumService, IPhotoService photoService, IVideoService videoService, ISlugService slugService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._albumService = albumService;
            this._photoService = photoService;
            this._videoService = videoService;
            this._slugService = slugService;
        }

        public IActionResult List(int argumentId, int pageSize, int pageNumber){      
            var model = new PostModel();

            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total =_postService.GetByArgumentId(argumentId).Count;

            model.sectionName = _argumentService.GetById(argumentId).name;
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.posts = _postService.GetByArgumentId(argumentId);
      
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

        public IActionResult GetById(string id){
            var model = new PostModel();

            //Convert slugId to Int and Find Post
            var slugId = Convert.ToInt32(id);
            var post = _postService.GetBySlugId(slugId);
            
            //BreadCrumb
            model.categoryName = _categoryService.GetById(post.categoryId).name;
            model.argumentName = _argumentService.GetById(post.argumentId).name;
            
            //Post data
            model.title = post.title;
            model.testo = post.testo;
            model.albumId = post.albumId;

            return View(model);
        }

    }
}