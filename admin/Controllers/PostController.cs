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
        private readonly IAlbumService _albumService;

        public PostController(ICommonService commonService, IPostService postService, IArgumentService argumentService, IAlbumService albumService){
            this._commonService = commonService;
            this._postService = postService;
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
            //Create Album with image and vleaideo for post
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
            
            model.title = _commonService.removeSpaceAndSlash(data["title"]);
            model.isArgument = Convert.ToBoolean(data["isChild"]);
            model.argumentId = Convert.ToInt32(data["path"]);
           
            if(model.isArgument == true){
                model.categoryId = _argumentService.GetById(model.argumentId).categoryId;
            } else {
                model.categoryId = 0;
            }

            model.albumId = albumId;
            model.testo = data["testo"];
            model.pubblico = Convert.ToBoolean(data["public"]);

            _postService.Insert(model);

            return View();
        }

        [HttpPost]
        public IList<PostModel> GetAll(){
            
            var models = new List<PostModel>();
            var posts = _postService.GetAll();

            // Add Data to model
            foreach(var post in posts){
          
                models.Add(new PostModel(){
                    id = post.id,
                    albumId = post.albumId,
                    argumentId = post.argumentId,
                    argumentName = _argumentService.GetById(post.argumentId).name,
                    isArgument = post.isArgument,
                    categoryId = post.categoryId,
                    pubblico = post.pubblico,
                });
          
            }

            //Update Model with category name
            foreach(var model in models){
                if(model.isArgument == true){
                    model.categoryName = _argumentService.GetById(model.argumentId).category.name;

                }
            }
            

            return models;
        }

        public IList<PostsPath> GetAllPath(){
            
            return _postService.GetAllPath();
        }


    }
}