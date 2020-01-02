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
using admin.Data;
using admin.Models;
using admin.Services;

namespace admin.Controllers
{
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
            
            //Add Post
            var model = new PostModel();
            
            model.title = data["title"];
            model.slug = _commonService.cleanStringPath(model.title);
            model.categoryId = Convert.ToInt32(data["categoryId"]);
            model.argumentId = Convert.ToInt32(data["argumentId"]);
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
        public IList<PostModel> GetAll(){
            
            var models = new List<PostModel>();
            var posts = _postService.GetAll();

            // Add Data to model
            foreach(var post in posts){
               var argumentName = string.Empty;

                if(post.argumentId > 0){
                    argumentName = _argumentService.GetById(post.argumentId).name;
                }
                
                models.Add(new PostModel(){
                    id = post.id,
                    albumId = post.albumId,
                    categoryId = post.categoryId,
                    categoryName = _categoryService.GetById(post.categoryId).name,
                    argumentId = post.argumentId,
                    argumentName = argumentName,
                    title = post.title,
                    testo = post.testo,
                    pubblico = post.pubblico
                });
          
            }
            
            return models;
        }

        public IList<PostsPath> GetAllPath(){
            
            return _postService.GetAllPath();
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
            model.PostsPath = _postService.GetAllPath();
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
            var post = new Post();

            post.categoryId = Convert.ToInt32(data["categoryId"]);
            post.argumentId = Convert.ToInt32(data["argumentId"]);
            post.title = data["title"];
            post.testo = data["testo"];
            post.slug = _commonService.cleanStringPath(post.title);
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