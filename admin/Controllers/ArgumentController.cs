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
        private readonly ICategoryService _categoryService;

        public ArgumentController(IArgumentService argumentService, ICategoryService categoryService){
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
            
            //Get folder name
            model.name = data["name"];            
            model.categoryId = Convert.ToInt32(data["idCategory"]);

            _argumentService.Insert(model);
           
            return View();
        }

        [HttpPost]
        public IList<ArgumentModel> GetAll(){
            
            var models = new List<ArgumentModel>();

            var arguments = _argumentService.GetAll();
            foreach(var argument in arguments)
            {
                models.Add(new ArgumentModel()
                {
                    id = argument.id,
                    categoryName = argument.category.name,
                    name = argument.name
                });

            }

            return models;
        }

        [HttpPost]
        public ArgumentModel GetById(int id){
            var model = new ArgumentModel();

            var argument = _argumentService.GetById(id);

            model.id = argument.id;
            model.categoryList = _categoryService.GetAll();
            model.name = argument.name;
            
            return model;
        }


        [HttpPost]
        public void Update(int id, IFormCollection data){
            var model = new ArgumentModel();
            model.name = data["name"];

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            _argumentService.Delete(id);
        }
    }
}