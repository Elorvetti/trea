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

        public PostController(ICommonService commonService, IPostService postService, ICategoryService categoryService ,IArgumentService argumentService, IAlbumService albumService){
            this._commonService = commonService;
            this._postService = postService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._albumService = albumService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Post";
        
            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection data){
            
            //Create Album with image and video for post
            var album = new AlbumModel();
            var albumId = 0;
            if(data["images"] != "" || data["video"] != "" ){
                album.idImmagini = data["images"];
                album.idVideo = data["video"];
                _albumService.Insert(album);

                albumId = _albumService.GetLast();
            }

            //Add Post
            var model = new PostModel();
            
            model.title = data["title"];
            model.slug = _commonService.cleanStringPath(model.title);
            model.categoryId = Convert.ToInt32(data["categoryId"]);
            model.argumentId = Convert.ToInt32(data["argumentId"]);
            model.albumId = albumId;
            model.testo = data["testo"];
            model.pubblico = Convert.ToBoolean(data["public"]);

            _postService.Insert(model);

            return View();
        }

        [HttpPost]
        public IList<PostModel> GetAll(){
            
            var models = new List<PostModel>();
            var model = new PostModel();
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
            
            model.title = post.title;
            model.testo = post.testo;
            model.PostsPath = _postService.GetAllPath();
            model.categoryId = post.categoryId;
            model.argumentId = post.argumentId;
            model.pubblico = post.pubblico;
            
            return model;
        }

    }
}