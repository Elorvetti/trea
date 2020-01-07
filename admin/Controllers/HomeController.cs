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
    public partial class HomeController : Controller{

        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;

        public HomeController(ICategoryService categoryService, IArgumentService argumentService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
        }

        public IActionResult Index(){
            ViewBag.Title = "Home Page";

            return View();
        }

        [HttpPost]
        public IList<Category> GetAllCategory(){
            return _categoryService.GetAll();
        }

        [HttpPost]
        public IList<ArgumentModel> GetAllArgument(){
                        
            var models = new List<ArgumentModel>();

            var arguments = _argumentService.GetAll();
            foreach(var argument in arguments)
            {
                models.Add(new ArgumentModel()
                {
                    id = argument.id,
                    categoryId = argument.category.id,
                    //categoryName = argument.category.name,
                    slug = argument.slug,
                    name = argument.name
                });

            }

            return models;
        }
    }
}