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
using System.Text.RegularExpressions;
using TreA.Presentation.Areas.Backoffice.Models;
using TreA.Data.Entities;
using TreA.Services.Common;
using TreA.Services.Post;
using TreA.Services.Argument;
using TreA.Services.Category;
using TreA.Services.Album;
using TreA.Services.Photo;
using TreA.Services.Video;
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class PostController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IPostService _postService;
        private readonly IArgumentService _argumentService;
        private readonly ICategoryService _categoryService;
        private readonly IAlbumService _albumService;
        private readonly IPhotoService _photoService;
        private readonly IVideoService _videoService;
        private readonly ISlugService _slugService;

        public PostController(ICommonService commonService, IPostService postService, ICategoryService categoryService ,IArgumentService argumentService, IAlbumService albumService, IPhotoService photoService, IVideoService videoService, ISlugService slugService){
            this._commonService = commonService;
            this._postService = postService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._albumService = albumService;
            this._photoService = photoService;
            this._videoService = videoService;
            this._slugService = slugService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Post";
        
            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection data){
            var model = new PostModel();
            
            var albumId = AddAlbumToPost(data);

            //Add Post
            var title = data["title"];
            int categoryId = Convert.ToInt32(data["categoryId"]);
            int argumentId = Convert.ToInt32(data["argumentId"]);

            model.title = title;
            model.subtitle = data["subtitle"];
            model.categoryId = categoryId;
            model.argumentId = argumentId;
            model.albumId = albumId;
            model.testo = data["testo"];
            model.PhotoId = Convert.ToInt32(data["coverImage"]);
            model.dateInsert = DateTime.Now;
            model.slugId = InsertSlug(model, categoryId, argumentId);

            if(data["IsPublic"] == "on"){
                model.pubblico = true;
            } else {
                model.pubblico = false;
            }

            _postService.Insert(model);

            return View();
        }

        [HttpPost]
        public PostModel GetAll(int pageSize, int pageNumber){
            var model = new PostModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _photoService.GetAll().Count;

            model.sectionName = "Photo";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.posts = _postService.GetAll(excludeRecords, pageSize);

            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }
            
            return model;
        }

        public IList<PostsPath> GetAllPath(){
            var models = new List<PostsPath>();
            var categories = _categoryService.GetAll();

            foreach(var category in categories){
                models.Add(new PostsPath(){
                    categoryId = category.id,
                    name = category.name
                });
            };

            var arguments = _argumentService.GetAll();
            foreach(var argument in arguments){
                models.Add(new PostsPath(){
                    categoryId = argument.category.id,
                    argumentId = argument.id,
                    name = argument.category.name + " / " + argument.name,
                });
            };

            return models.OrderBy( p => p.name).ToList();
        }
        public PostModel GetById(int id){            
            var model = new PostModel();
            var post = _postService.GetById(id);
            
            if(post.albumId > 0){
                model.album = _albumService.GetById(post.albumId);
            }
            
            model.id = post.id;
            model.albumId = post.albumId;
            model.PhotoId = post.PhotoId;
            model.title = post.title;
            model.subtitle = post.subtitle;
            model.testo = post.testo;
            model.PostsPath = GetAllPath();
            model.categoryId = post.categoryId;
            model.argumentId = post.argumentId;
            model.pubblico = post.pubblico;

            //Get category and argument name
            model.categoryName = _categoryService.GetById(post.categoryId).name;

            if(post.argumentId > 0){
                model.argumentName = _argumentService.GetById(post.argumentId).name;
            } else {
                model.argumentName = "";
            }
            
            return model;
        }
        
        public void Update(int id, IFormCollection data){
            var post = new Posts();

            var postTitle = data["title"]; 
            var categoryId = Convert.ToInt32(data["categoryId"]);
            var argumentId = Convert.ToInt32(data["argumentId"]);

            post.categoryId = categoryId;
            post.argumentId = argumentId;
            post.title = postTitle;
            post.subtitle = data["subtitle"];
            post.testo = data["testo"];
            post.PhotoId = Convert.ToInt32(data["coverImage"]);
            post.slugId = _postService.GetById(id).slugId;

            UpdateSlug(post);

            if(data["IsPublic"] == "on"){
                post.pubblico = true;
            } else {
                post.pubblico = false;
            }

            post.albumId = UpdateAlbumPost(id, data);

            _postService.Update(id, post);
        }  
        public void Delete(int id){
            var post = _postService.GetById(id);

            _postService.Delete(id);
            _slugService.Delete(post.slugId);

            if(post.albumId > 0){
                _albumService.Delete(post.albumId);
            }
        }
       
        [HttpPost]
        public PostModel Find(int categoryId, int argumentId, int pageSize, int pageNumber, string title = "", string IsPublic = ""){
            var model = new PostModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;            
            
            model.posts = _postService.Find(categoryId, argumentId, title, IsPublic, excludeRecords, pageSize);

            var total = model.posts.Count;
            
            model.sectionName = "Post";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);

            return model;
        }

        public IActionResult Preview(int id){
            var model = new PostModel();

            //Convert slugId to Int and Find Post
            var post = _postService.GetById(id);
            
            //BreadCrumb
            model.categoryName = _categoryService.GetById(post.categoryId).name;
            var argument = _argumentService.GetById(post.argumentId);
            if(argument != null){
                model.argumentName = argument.name;
            }
            model.breadcrumb = string.Concat(model.categoryName, " > ", model.argumentName, " > ", post.title);

            //Post data
            model.id = post.id;
            model.coverImage = _photoService.GetById(post.PhotoId).path;
            model.title = post.title;
            model.subtitle = post.subtitle;
            model.testo = post.testo;
            model.albumId = post.albumId;
            model.argumentId = post.argumentId;

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

            //Related argument
            var relatedArguments = _argumentService.GetByCategoryId(post.categoryId);
            foreach(var relatedArgument in relatedArguments){
                model.realtedArgument.Add(new ArgumentDisplay(){
                    id = relatedArgument.id,
                    title = relatedArgument.name,
                    nOfElement = _postService.GetByArgumentId(relatedArgument.id).Count,
                    slug = _slugService.GetById(relatedArgument.slugId).name
                });
            }

            //Album
            var album = _albumService.GetById(post.albumId);
            
            if(album != null){
                var imageIds = album.idImmagini.Split('|');
                foreach(var imageId in imageIds){
                    if(!string.IsNullOrEmpty(imageId)){
                        model.albumDisplay.Add(_photoService.GetById(Convert.ToInt32(imageId)).path);
                    }
                }

                var videoIds = album.idVideo.Split('|');
                foreach(var videoId in videoIds){
                    if(!string.IsNullOrEmpty(videoId)){
                        model.albumDisplay.Add(_videoService.GetById(Convert.ToInt32(videoId)).path);
                    }
                }
            
            }



  
            return View(model);
            
        }

        public int AddAlbumToPost(IFormCollection data){
            var album = new AlbumModel();
            var albumId = 0;

            if(data["images"] != "" || data["video"] != "" ){
                album.idImmagini = data["images"];
                album.idVideo = data["video"];
                _albumService.Insert(album);

                albumId = _albumService.GetLast();
            }

            return albumId;
        }
        public int UpdateAlbumPost(int postId, IFormCollection data){
            var album = new AlbumModel();
            int albumId = _postService.GetById(postId).albumId;

            // Update album image and video
            if(albumId > 0){                
                //update album with video and image
                if(data["images"] != "" || data["video"] != "" ){
                    album.idImmagini = data["images"];
                    album.idVideo = data["video"];

                    _albumService.Update(albumId, album);
                } else {
                    //remove album from post
                    _albumService.Delete(albumId);
                    albumId = 0;
                }
            } else {
                //create album 
                albumId = AddAlbumToPost(data);
            }

            return albumId;
        }

        [HttpPost]
        public IList<PostDisplay> GetLast(int id){            
            var model = new List<PostDisplay>();
            var posts = _postService.GetLast(id);
           
           foreach(var post in posts){
                model.Add(new PostDisplay(){
                    id = post.id,
                    slug = _slugService.GetById(post.slugId).name,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = Regex.Replace(post.testo, "<.*?>", string.Empty).Substring(0, 200)
                });
           }
           
           
           return model;
        }

        public int InsertSlug(PostModel post, int categoryId, int argumentId){
            int slugId = 0;
            if(argumentId == 0 ){
                slugId = _categoryService.GetById(categoryId).slugId;
            } else {
                slugId = _argumentService.GetById(argumentId).slugId;
            }

            var categoryArgumentSlug = _slugService.GetById(slugId).name;
            var name = string.Concat(categoryArgumentSlug, _commonService.cleanStringPath(post.title), '/');
            
            var model = new SlugModel();
            model.name = name;
            model.entityname = "Post";

            _slugService.Insert(model);
            
            return _slugService.GetByName(name).id;
        }

        public void UpdateSlug(Posts model){
            var postSlug = string.Concat(_commonService.cleanStringPath(model.title), '/');
            var categoryArgumentSlug = _slugService.GetById(model.slugId).name;
            
            var exist = categoryArgumentSlug.IndexOf(postSlug);
            if(exist > 0){
               categoryArgumentSlug = categoryArgumentSlug.Remove(exist);
            }
            string  name = string.Concat(categoryArgumentSlug,postSlug);
            
            _slugService.Update(model.slugId, name);
            
        }
    }
}