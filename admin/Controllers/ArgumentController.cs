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
            
            //Get folder name
            string path = data["path"];

            //Replace white space and / with -
            string pathIO = path .Replace(" ", "-").Replace("/", "-");
            
            //Check if folder already exist and create
            var exist = _folderService.Exist(pathIO);
            if (!exist)
            {
                model.name = pathIO;
                model.path = "/" + pathIO + "/";
                _argumentService.Insert(model);
                _folderService.Create(pathIO);
            } 
            else
            {
                return Json("Errore");
            }
           
            return View();
        }

        [HttpPost]
        public IList<Argument> GetAll(){
            var arguments = _argumentService.GetAll();

            return arguments;
        }

        [HttpPost]
        public Argument GetById(int id){
            return _argumentService.GetById(id);
        }


        [HttpPost]
        public void Update(int id, IFormCollection data){
            var model = new ArgumentModel();
            string name = data["path"];

            //Set folder name and folder path
            model.name = name.Replace(" ", "-").Replace("/", "-");
            model.path = "/" + model.name + "/";

            //get folder name
            var folderName = _argumentService.GetFolderName(id);
            _folderService.Update(folderName, model.name);

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            var folderName = _argumentService.GetFolderName(id);
            _argumentService.Delete(id);
            _folderService.Delete(folderName);

        }

    }
}