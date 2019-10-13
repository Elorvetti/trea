using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using admin.Data;
using admin.Models;
using admin.Services;

namespace admin.Controllers
{
    public partial class LoginController : Controller
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            this._loginService = loginService;
        }

        public IActionResult Index()
        {
            var model = new AdministratorModel();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(AdministratorModel model)
        {
            if(ModelState.IsValid){
               var isAdmin = _loginService.IsAdmin(model);
               if(isAdmin){
                  return  RedirectToAction("Index", "Home");
               }
            }
            
            return View();
        }

    }
}
