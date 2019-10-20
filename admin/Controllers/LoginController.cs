using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using admin.Data;
using admin.Models;
using admin.Services;

namespace admin.Controllers
{
    public partial class LoginController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILoginService _loginService;

        public LoginController(SignInManager<IdentityUser> signInManager, ILoginService loginService)
        {
            this._signInManager = signInManager;
            this._loginService = loginService;
        }
        
        [AllowAnonymous]
        public IActionResult Index()
        {
            var model = new AdministratorModel();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(AdministratorModel model)
        {
            if(ModelState.IsValid){
               var isAdmin = _loginService.IsAdmin(model);
               if(isAdmin){
                   var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);

                   if(result.Succeeded){
                       ViewBag.User = model.Email;
                        return RedirectToAction("Index", "User");
                    }

               }
                ModelState.AddModelError("LoginError", "Email o Password errata");
            }
            return View(model);
        }
    }
}
