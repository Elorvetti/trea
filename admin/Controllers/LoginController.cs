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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILoginService _loginService;

        public LoginController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ILoginService loginService)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
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
                   var result = await _signInManager.PasswordSignInAsync(model.email, model.password, model.rememberMe, false);

                   if(result.Succeeded){
                        return RedirectToAction("Index", "Home");
                    }

               }
                ModelState.AddModelError("LoginError", "Email o Password errata");
            }
            return View(model);
        }

        [NonAction]
        public async Task<IActionResult> LogOut(){
            await _signInManager.SignOutAsync();

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> RegisterUserIdentity(AdministratorModel model){
            var user = new IdentityUser{ UserName = model.email, Email = model.email };
            var result = await _userManager.CreateAsync(user, model.password);
            if(result.Succeeded){
               await _signInManager.SignInAsync(user, isPersistent: false );
               return Json("");
            }

            return Json("");
        }

    }
}
