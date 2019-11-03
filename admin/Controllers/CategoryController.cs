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
    public partial class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IFolderService _folderService;

        public CategoryController(ICategoryService categoryService, IFolderService folderService){
            this._categoryService = categoryService;
            this._folderService = folderService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Categorie";

            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection category){
            var model = new CategoryModel();

            //Create folder for category
            string path = category["name"];
            int displayOrder = Convert.ToInt32(category["order"]);
            string pathClean = _folderService.removeSpaceAndSlash(path);

            //Check if folder exist
            var exist = _folderService.Exist(pathClean);
            if(!exist){
                model.name = pathClean;
                model.displayOrder = displayOrder;
                _categoryService.Insert(model);
                _folderService.Create(pathClean);

                return View();
            }

            return Json("Errore");
        }

        [HttpPost]
        public IList<Category> GetAll(){
            return _categoryService.GetAll();
        }

        [HttpPost]
        public Category GetById(int id){
            return _categoryService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection category){
            var model = new CategoryModel();

            //get folder name from system
            var folder = _categoryService.GetById(id);

            //Get data from form
            string path = category["name"];
            int displayOrder = Convert.ToInt32(category["order"]);

            string pathClean = _folderService.removeSpaceAndSlash(path);
            var exist = _folderService.Exist(pathClean);

            if(!exist){
                //Update system folder
                _folderService.Update(folder.name, pathClean);

                //Update dbset 
                model.name = pathClean;
                model.displayOrder = displayOrder;
                _categoryService.Update(id, model);
            }
        }

        [HttpPost]
        public void Delete(int id){
            var folder = _categoryService.GetById(id);
            
            _folderService.Delete(folder.name);
            _categoryService.Delete(id);

        }
    }
}