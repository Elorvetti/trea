using System;
using Microsoft.AspNetCore.Mvc;
using TreA.Presentation.Models;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;

namespace TreA.Presentation.Controllers
{

    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        
        public CategoryController(ICategoryService categoryService, IArgumentService argumentService, IPostService postService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
        }

        public IActionResult GetById(string id){
            
            //If in ARGUMENT list are more then one argumet show list else only this argument
            //If there aren't ARGUMENT list search one or more POST of this category 
            //If there are a list of POST show list else only this post
            
            //Convert slugId to Int and Find CategoryId
            var slugId = Convert.ToInt32(id);
            var categoryId = _categoryService.GetBySlugId(slugId).id;

            //Get ARGUMENT of category
            var arguments = _argumentService.GetByCategoryId(categoryId);
            
            //If ARGUMENT are a list show list else only data conneted to this argument
            if(arguments.Count > 1){
                return RedirectToActionPermanent("List", "Argument", new{categoryId = categoryId, pageSize = 50, pageNumber = 1});
            } else if(arguments.Count == 1){
                return RedirectToActionPermanent("List", "Post", new {categoryId = categoryId, pageSize = 50, pageNumber = 1 });
            }

            return Json("No Redirect");
        }

        
        public IActionResult Post(CategoryModel model){
            
            return View();
        }



    }
}