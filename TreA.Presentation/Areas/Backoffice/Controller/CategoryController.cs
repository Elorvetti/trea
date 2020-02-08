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
using TreA.Services.Post;
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class CategoryController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly ISlugService _slugService;
        public CategoryController(ICommonService commonService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService ,ISlugService slugService){
            this._commonService = commonService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
        }

        [Authorize]
        [HttpPost]
        public void Index(IFormCollection category){
            var model = new CategoryModel();            

            model.name = category["name"];
            model.description = category["description"];
            model.displayOrder = Convert.ToInt32(category["order"]);;
            model.slugId = InsertSlug(model);

            _categoryService.Insert(model);
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

            model.id = id;
            model.name = category["name"];
            model.displayOrder = Convert.ToInt32(category["order"]);
            model.description = category["description"];
            model.slugId = _categoryService.GetById(id).slugId;
            
            UpdateSlug(model);

            _categoryService.Update(id, model);

        }

        [HttpPost]
        public void Delete(int id){
            var category = _categoryService.GetById(id);
            
            _categoryService.Delete(id);
            _slugService.Delete(category.slugId);

        }

        [HttpPost]
        public CategoryModel Find(string name, int pageSize, int pageNumber){
            var model = new CategoryModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;          
            model.categories = _categoryService.Find(name, excludeRecords, pageSize);  
                        
            var total = model.categories.Count;
            model.sectionName = "Category";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);

            return model;
        }

        public int InsertSlug(CategoryModel category){
            var name = string.Concat("/Blog", '/', _commonService.cleanStringPath(category.name), '/');
            
            var model = new SlugModel();
            model.name = name;
            model.entityname = "Category";

            _slugService.Insert(model);
            
            return _slugService.GetByName(name).id;
        }

        public void UpdateSlug(CategoryModel category){
            var categorySlug =  _commonService.cleanStringPath(category.name);
            
            //Get all argument with this category id and update slug
            var arguments = _argumentService.GetByCategoryId(category.id);
            foreach(var arg in arguments){
                var slug = _slugService.GetById(arg.slugId).name;
                var replace = _slugService.GetById(category.slugId).name.Split('/').Where(x => !string.IsNullOrEmpty(x)).ToArray();
                var newSlug = slug.Replace(replace[replace.Length - 1], categorySlug);      
                _slugService.Update(arg.slugId, newSlug);
            }

            //Get all post with this category id and update slug
            var posts = _postService.GetAllByCategory(category.id);
            foreach(var post in posts){
                var slug = _slugService.GetById(post.slugId).name;
                var replace = _slugService.GetById(category.slugId).name.Split('/').Where(x => !string.IsNullOrEmpty(x)).ToArray();
                var newSlug = slug.Replace(replace[replace.Length - 1], categorySlug);
                _slugService.Update(post.slugId, newSlug);
            }

            var oldSlug = _slugService.GetById(category.slugId).name;
            var slugArray = oldSlug.Split('/').Where(x => !string.IsNullOrEmpty(x)).ToArray();
            var name = oldSlug.Replace(slugArray[slugArray.Length -1], categorySlug);            
            _slugService.Update(category.slugId, name);    
        }
    }
}