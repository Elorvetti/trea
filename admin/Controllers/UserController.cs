using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using admin.Data;
using admin.Models;
using admin.Services;


namespace admin.Controllers
{
    public partial class UserController : Controller
    {

        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IUserService _userService;


        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IUserService userService){
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._userService = userService;
        }

        [Authorize]
        public IActionResult Index()
        {
            ViewBag.Title = "Utenti";
            ViewBag.User = User.Identity.Name;
            
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection data)
        {
            var model = new AddAdministratorModel();
            model.Email = data["email"];
            model.Password = data["password"];
            model.ConfirmPassword = data["confirmPassword"];
            
            //User Is Active
            if(data["active"] == "on")
            {
                model.IsActive = true;
            }
            else
            {
                model.IsActive = false;
            }

            await InsertUser(model);

            return View();
        }

        [HttpPost]
        public IList<Administrator> GetAllUsers(){
            
            var users = _userService.GetAllUser();

            return users;
        }

        [HttpPost]
        public Administrator GetUserById(int id){
            return _userService.GetUserById(id);
        }

        [HttpPost]
        public void UpdateUser(int id, IFormCollection data)
        {
            var model = new Administrator();
            if(data["active"] == "on")
            { 
                model.IsActive = true;
            } 
            else
            if(data["password"] == data["confirmPassword"])
            {
                model.IsActive = false;
            }
          _userService.UpdateUser(id, model);
        }

        [NonAction]
        public async Task<bool> UpdateUserPassword(string email, string oldPassword, string newPassord)
        {
            //Get current user
            var user = await _userManager.FindByEmailAsync(email);

            //Update user password
            var update = await _userManager.ChangePasswordAsync(user, oldPassword, newPassord);
            return update.Succeeded;
            
        }

        [NonAction]
        public async Task<IActionResult> InsertUser(AddAdministratorModel model){
            
            // 1. Add data to interface of repository
            var admin = new Administrator();

            admin.user = model.Email;
            admin.password = model.Password;
            admin.IsActive = model.IsActive;
            
            // 2. Add Identity User
            var user = new IdentityUser{ UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if(result.Succeeded){
               await _signInManager.SignInAsync(user, isPersistent: false );
               
               // 2.1. Update repository
                _userService.InsertUser(admin);
               
               return Json("Inser ok");
            }

            return Json("");
        }

        public async Task<IActionResult> Logout(){
            await _signInManager.SignOutAsync();

            return RedirectToAction("Index", "Login");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
