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
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class ArgumentController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IArgumentService _argumentService;
        private readonly ICategoryService _categoryService;
        private readonly ISlugService _slugService;

        public ArgumentController(ICommonService commonService, IArgumentService argumentService, ICategoryService categoryService, ISlugService slugService){
            this._commonService = commonService;
            this._argumentService = argumentService;
            this._categoryService = categoryService;
            this._slugService = slugService;
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

            //Get folder name
            model.name = data["name"];   
            model.description = data["description"];
            model.categoryId = categoryId;
            model.coverImageId = Convert.ToInt32(data["coverImage"]);
            model.slugId = InsertSlug(model, categoryId);

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
            model.coverImageId = argument.coverImageId;
            
            return model;
        }


        [HttpPost]
        public void Update(int id, IFormCollection data){
            var model = new ArgumentModel();
            
            var categoryId = _argumentService.GetById(id).categoryId;
            
            model.name = data["name"];
            model.categoryId = Convert.ToInt32(data["idCategory"]);
            model.description = data["description"];
            model.coverImageId = Convert.ToInt32(data["coverImage"]);
            model.slugId = _argumentService.GetById(id).slugId;
            
            UpdateSlug(model);

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            var argument = _argumentService.GetById(id);

            _argumentService.Delete(id);
            _slugService.Delete(argument.slugId);
        }

        [HttpPost]
        public ArgumentModel Find(int idCategory, int pageSize, int pageNumber, string name = ""){
            var model = new ArgumentModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;            
            
            model.arguments = _argumentService.Find(idCategory, name, excludeRecords, pageSize);

            var total = model.arguments.Count;
            
            model.sectionName = "Argument";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);

            return model;
        }
        public int InsertSlug(ArgumentModel argument, int categoryId){
            var categorySlugId = _categoryService.GetById(categoryId).slugId;
            var categorySlug = _slugService.GetById(categorySlugId).name;
            var name = string.Concat(categorySlug, _commonService.cleanStringPath(argument.name), '/');
            
            var model = new SlugModel();
            model.name = name;
            model.entityname = "Argument";

            _slugService.Insert(model);
            
            return _slugService.GetByName(name).id;
        }

        public void UpdateSlug(ArgumentModel argument){
            var postSlug = string.Concat(_commonService.cleanStringPath(argument.name), '/');
            var categorySlug = _slugService.GetById(argument.slugId).name;
            
            var exist = categorySlug.IndexOf(postSlug);
            if(exist > 0){
               categorySlug = categorySlug.Remove(exist);
            }
            
            string  name = string.Concat(categorySlug, postSlug);
            
            _slugService.Update(argument.slugId, name);
            
        }
    }
}