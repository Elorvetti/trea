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
        private readonly IArgumentService _argumentService;

        public CategoryController(ICategoryService categoryService, IArgumentService argumentService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
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
            string pathClean = _categoryService.removeSpaceAndSlash(path);

            model.name = pathClean;
            model.displayOrder = displayOrder;
            _categoryService.Insert(model);

            return View();
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
            string categoryName = category["name"];
            int displayOrder = Convert.ToInt32(category["order"]);

            string categoryNameClean = _categoryService.removeSpaceAndSlash(categoryName);
            model.name = categoryNameClean;
            model.displayOrder = displayOrder;

            _categoryService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            var folder = _categoryService.GetById(id);

            //Find all argument in category and remove it
            var arguments = _argumentService.GetByIdCategory(id);
            foreach(var argument in arguments)
            {
                _argumentService.Delete(argument.id);
            }
            
            _categoryService.Delete(id);

        }
    }
}