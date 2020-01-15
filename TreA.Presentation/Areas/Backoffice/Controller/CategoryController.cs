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
using TreA.Data.Entities;
using TreA.Services.Common;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class CategoryController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;

        private readonly ISlugService _slugService;
        public CategoryController(ICommonService commonService, ICategoryService categoryService, IArgumentService argumentService, ISlugService slugService){
            this._commonService = commonService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._slugService = slugService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Categorie";

            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormCollection category){
            var model = new CategoryModel();            

            model.name = category["name"];
            model.description = category["description"];
            model.displayOrder = Convert.ToInt32(category["order"]);;
            model.slugId = InsertSlug(model);

            _categoryService.Insert(model);

            return View();
        }

        [HttpPost]
        public CategoryModel GetAll(int pageSize, int pageNumber){
            var model = new CategoryModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _categoryService.GetAll().Count;

            model.sectionName = "Category";
            model.pageSize = pageSize;
            model.pageTotal = Math.Ceiling((double)total / pageSize);
            model.categories = _categoryService.GetAll(excludeRecords, pageSize);

            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }

            return model;
        }

        [HttpPost]
        public Categories GetById(int id){
            return _categoryService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection category){
            var model = new CategoryModel();

            model.name = category["name"];
            model.displayOrder = Convert.ToInt32(category["order"]);
            model.description = category["description"];
            
            UpdateSlug(model);

            _categoryService.Update(id, model);

        }

        [HttpPost]
        public void Delete(int id){
            var category = _categoryService.GetById(id);
            
            _categoryService.Delete(id);
            _slugService.Delete(category.slugId);

        }
 
        public int InsertSlug(CategoryModel category){
            var name = string.Concat('/', _commonService.cleanStringPath(category.name), '/');
            
            var model = new SlugModel();
            model.name = name;

            _slugService.Insert(model);
            
            return _slugService.GetByName(name).id;
        }

        public void UpdateSlug(CategoryModel category){
            string  name = string.Concat('/', _commonService.cleanStringPath(category.name), '/');

            _slugService.Update(category.slugId, name);
            
        }
    }
}