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
        private readonly IPostService _postService;
        private readonly IArgumentService _argumentService;
        private readonly IAlbumService _albumService;

        public PostController(IPostService postService, IArgumentService argumentService, IAlbumService albumService){
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
            
            return View();
        }

        [HttpPost]
        public IList<Post> GetAll(){

            return _postService.GetAll();
        }


    }
}