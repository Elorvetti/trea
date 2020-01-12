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
using TreA.Services.Common;
using TreA.Services.Post;
using TreA.Services.Argument;
using TreA.Services.Category;
using TreA.Services.Album;
using TreA.Services.Photo;

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

        public PostController(ICommonService commonService, IPostService postService, ICategoryService categoryService ,IArgumentService argumentService, IAlbumService albumService, IPhotoService photoService){
            this._commonService = commonService;
            this._postService = postService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._albumService = albumService;
            this._photoService = photoService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Post";
        
            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection data){

            var albumId = AddAlbumToPost(data);
            var a = data["categoryId"];
            //Add Post
            var model = new PostModel();
            int categoryId = Convert.ToInt32(data["categoryId"]);
            int argumentId = Convert.ToInt32(data["argumentId"]);
            var postSlug = "";

            if(argumentId == 0 ){
                postSlug = string.Concat(_categoryService.GetById(categoryId).slug, _commonService.cleanStringPath(model.title), '/');
            } else {
                postSlug = string.Concat(_argumentService.GetById(argumentId).slug, _commonService.cleanStringPath(model.title), '/');
            }

            model.title = data["title"];
            model.slug = postSlug;
            model.categoryId = categoryId;
            model.argumentId = argumentId;
            model.albumId = albumId;
            model.testo = data["testo"];
            model.PhotoId = Convert.ToInt32(data["coverImage"]);

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
            var postSlug = "";

            if(argumentId == 0){
                postSlug = string.Concat(_categoryService.GetById(categoryId).slug, _commonService.cleanStringPath(postTitle), '/');
            } else {
                postSlug = string.Concat(_argumentService.GetById(argumentId).slug, _commonService.cleanStringPath(postTitle), '/');
            }

            post.categoryId = categoryId;
            post.argumentId = argumentId;
            post.title = postTitle;
            post.testo = data["testo"];
            post.slug = postSlug;
            post.PhotoId = Convert.ToInt32(data["coverImage"]);

            if(data["IsPublic"] == "on"){
                post.pubblico = true;
            } else {
                post.pubblico = false;
            }

            post.albumId = UpdateAlbumPost(id, data);

            _postService.Update(id, post);
        }
    
        public void Delete(int id){
            
            int albumiId = _postService.GetById(id).albumId;
            _postService.Delete(id);

            if(albumiId > 0){
                _albumService.Delete(albumiId);
            }

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
                    slug = post.slug,
                    coverImage = _photoService.GetById(post.PhotoId).path,
                    title = post.title,
                    testo = post.testo
                });
           }
           
           
           return model;
        }

    }
}