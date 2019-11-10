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
        
        public ArgumentController(IArgumentService argumentService){
            this._argumentService = argumentService;
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
            model.idCategory = Convert.ToInt32(data["idCategory"]);
            model.name = data["name"];            
            
            _argumentService.Insert(model);
           
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
            model.idCategory = Convert.ToInt32(data["idCategory"]);
            model.name = data["name"];

            _argumentService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            var folder = _argumentService.GetById(id);
            _argumentService.Delete(id);
        }
    }
}