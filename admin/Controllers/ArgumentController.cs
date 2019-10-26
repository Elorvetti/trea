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
    public partial class ArgumentController : Controller
    {

        private readonly IArgumentService _argumentService;
        private readonly IFolderService _folderService;
        
        public ArgumentController(IArgumentService argumentService, IFolderService folderService){
            this._argumentService = argumentService;
            this._folderService = folderService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Argomenti";

            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection data){
            var model = new ArgumentModel();
            string path = data["path"];
            string pathIO = path .Replace(" ", "-").Replace("/", "-");
            
            var exist = _folderService.Exist(pathIO);

            model.Path = "/" + pathIO + "/";

            return View();
        }

        [HttpPost]
        public IList<Argument> GetAll(){
            var arguments = _argumentService.GetAll();

            return arguments;
        }

    }
}