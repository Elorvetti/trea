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
        private readonly IPhotoService _photoService;


        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IUserService userService, IPhotoService photoService){
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._userService = userService;
            this._photoService = photoService;
        }

        [Authorize]
        public IActionResult Index()
        {
            var model = new AdministratorModel();
            
            ViewBag.Title = "Utenti";
            
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection data)
        {
            var model = new AddAdministratorModel();
            model.Email = data["email"];
            model.Password = data["password"];
            model.ConfirmPassword = data["confirmPassword"];
            model.photoId = Convert.ToInt32(data["photoId"]);

            //User Is Active
            if(data["active"] == "on")
            {
                model.IsActive = true;
            }
            else
            {
                model.IsActive = false;
            }
            if(model.Email == "" || model.Password == "" || model.ConfirmPassword == "")
            {
                return Json("Error");
            }

            await Insert(model);

            return View();
        }

        [HttpPost]
        public IList<Administrator> GetAll(){
            
            var users = _userService.GetAll();

            return users;
        }

        [HttpPost]
        public Administrator GetById(int id){
            var model = new UserModel();
            var user = _userService.GetById(id);

            model.id = user.id;
            model.IsActive = user.IsActive;
            model.user = user.user;
            if(user.photoId > 0)
            {
                model.photoId = user.photoId;
                model.photoPath = _photoService.GetById(model.photoId).path;
            }

            return model;
        }

        [NonAction]
        public async Task<IActionResult> Insert(AddAdministratorModel model){
            
            // 1. Add data to interface of repository
            var admin = new UserModel();

            admin.user = model.Email;
            admin.password = model.Password;
            admin.IsActive = model.IsActive;
            admin.photoId = model.photoId;

            // 2. Add Identity User
            var user = new IdentityUser{ UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if(result.Succeeded){
               await _signInManager.SignInAsync(user, isPersistent: false );
               
               // 2.1. Update repository
                _userService.Insert(admin);
               
               return Json("Inser ok");
            }

            return Json("");
        }

        public async Task<IActionResult> Logout(){
            await _signInManager.SignOutAsync();

            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        public void Update(int id, IFormCollection data){
            var model = new Administrator();
            if(data["active"] == "on")
            { 
                model.IsActive = true;
            } 
            else
            {
                model.IsActive = false;
            }
            model.photoId = Convert.ToInt32(data["photoId"]);
          _userService.Update(id, model);
        }

        [NonAction]
        public async Task<bool> UpdatePassword(string email, string oldPassword, string newPassord)
        {
            //Get current user
            var user = await _userManager.FindByEmailAsync(email);

            //Update user password
            var update = await _userManager.ChangePasswordAsync(user, oldPassword, newPassord);
            return update.Succeeded;
            
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            //Get user by ID
            Administrator admin = GetById(id);
            
            //Get user Identity
            var user = await _userManager.FindByEmailAsync(admin.user);

            if(user == null){
                return Json("Error");
            } else {
                var result = await _userManager.DeleteAsync(user);
                if(result.Succeeded){
                    _userService.Delete(id);
                }
            }
            return Json("deleted done");
        }

        [HttpPost]
        public UserModel GetUserContext(){
            var model = new UserModel();

            var userContext = _userManager.GetUserName(HttpContext.User);
            var user = _userService.GetByEmail(userContext);

            model.user = user.user;
            model.photoPath = _photoService.GetById(user.photoId).path;

            return model;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
