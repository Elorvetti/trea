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
            var folder = _argumentService.GetById(id);
            var newFolderName = folder.systemPath + '\\' + model.name;
            _folderService.Update(folder.systemPath, newFolderName);

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            var folder = _argumentService.GetById(id);
            _argumentService.Delete(id);
            _folderService.Delete(folder.systemPath);

        }

        [HttpPost]
        public IActionResult AddChild(int id, IFormCollection data){

            //Get folder name by form and replace white space or / with -
            string folderChildName = data["name"];
            folderChildName = folderChildName.Replace(" ", "-").Replace("/", "-");

            //Get folder id pressed
            var folders = _argumentService.GetById(id);

            //Check if folder child exist
            var newfolderPathSystem = folders.systemPath + '\\' + folderChildName;
            var Exist = _folderService.Exist(newfolderPathSystem);

            if (!Exist)
            {
                _folderService.Create(newfolderPathSystem);
                //Set path IO
                string folderChildNameIO = folderChildName + '/';

                //Get folder father
                var folder = _argumentService.GetById(id);

                //Set data of folder child
                var folderChild = new ArgumentModel();
                folderChild.idFather = folder.id;
                folderChild.level = folder.level + 1;
                folderChild.name = folderChildName;
                folderChild.path = folder.path + folderChildNameIO;
                folderChild.systemPath = folder.systemPath + '\\' + folderChildName;

                _argumentService.Insert(folderChild);
            }

            return Json("Errore");
           
        }

    }
}