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
using TreA.Services.Common;
using TreA.Services.Category;
using TreA.Services.Argument;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class ArgumentController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IArgumentService _argumentService;
        private readonly ICategoryService _categoryService;

        public ArgumentController(ICommonService commonService, IArgumentService argumentService, ICategoryService categoryService){
            this._commonService = commonService;
            this._argumentService = argumentService;
            this._categoryService = categoryService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Argomenti";

            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection data){
            var model = new ArgumentModel();
            
            var categoryId = Convert.ToInt32(data["idCategory"]);
            var categorySlug = _categoryService.GetById(categoryId).slug;

            //Get folder name
            model.name = data["name"];   
            model.slug = string.Concat(categorySlug, _commonService.cleanStringPath(model.name), '/');
            model.description = data["description"];
            model.categoryId = categoryId;

            _argumentService.Insert(model);
           
            return View();
        }

        [HttpPost]
        public ArgumentModel GetAll(int pageSize, int pageNumber){
            var model = new ArgumentModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _argumentService.GetAll().Count;

            model.sectionName = "Argomenti";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.arguments = _argumentService.GetAll(excludeRecords, pageSize);

            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }

            return model;
        }

        [HttpPost]
        public ArgumentModel GetById(int id){
            var model = new ArgumentModel();

            var argument = _argumentService.GetById(id);

            model.id = argument.id;
            model.categoryId = argument.categoryId;
            model.category = _categoryService.GetById(argument.categoryId);
            model.categories = _categoryService.GetAll();
            model.name = argument.name;
            model.description = argument.description;
            
            return model;
        }


        [HttpPost]
        public void Update(int id, IFormCollection data){
            var model = new ArgumentModel();
            
            var categoryId = _argumentService.GetById(id).categoryId;
            var categorySlug = _categoryService.GetById(categoryId).slug;

            model.name = data["name"];
            model.slug = string.Concat(categorySlug, _commonService.cleanStringPath(model.name), '/');;
            model.categoryId = Convert.ToInt32(data["idCategory"]);
            model.description = data["description"];

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            _argumentService.Delete(id);
        }
    }
}