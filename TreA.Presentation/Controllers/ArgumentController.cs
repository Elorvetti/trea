using System;
using Microsoft.AspNetCore.Mvc;
using TreA.Presentation.Models;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Slug;
using TreA.Services.Photo;

namespace TreA.Presentation.Controllers
{
    public class ArgumentController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly ISlugService _slugService;
        private readonly IPhotoService _photoService;

        public ArgumentController(IArgumentService argumentService, ICategoryService categoryService, IPostService postService, ISlugService slugService, IPhotoService photoService){
            this._argumentService = argumentService;
            this._categoryService = categoryService;
            this._postService = postService;
            this._slugService = slugService;
            this._photoService = photoService;
        }

        public IActionResult All(int pageSize, int pageNumber){
            var model = new ArgumentModel();

            //SEO 
            ViewBag.description = "Categorie disponibili";

            //List
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total =_argumentService.GetAll().Count;

            model.sectionName = "Lista Categorie";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.arguments = _argumentService.GetAll();

            foreach(var argument in model.arguments){
                model.argumentsDisplay.Add(new ArgumentDisplay(){
                    id = argument.id,
                    slug = _slugService.GetById(argument.slugId).name,
                    coverImage = _photoService.GetById(argument.coverImageId).path,
                    title = argument.name
                });
            }

            return View(model);
        }
        public IActionResult List(int categoryId, int pageSize, int pageNumber, string slug){      
            var model = new ArgumentModel();

            //SEO 
            ViewBag.description = _categoryService.GetById(categoryId).description;

            //List
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total =_argumentService.GetByCategoryId(categoryId).Count;

            model.sectionName = _categoryService.GetById(categoryId).name;
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.arguments = _argumentService.GetByCategoryId(categoryId);

            foreach(var argument in model.arguments){
                model.argumentsDisplay.Add(new ArgumentDisplay(){
                    id = argument.id,
                    slug = _slugService.GetById(argument.slugId).name,
                    coverImage = _photoService.GetById(argument.coverImageId).path,
                    title = argument.name
                });
            }

            return View(model);
        }
        public IActionResult GetBySlugId(string id){
            
            //If in ARGUMENT list are more then one argumet show list else only this argument
            //If there aren't ARGUMENT list search one or more POST of this category 
            //If there are a list of POST show list else only this post
            
            //Convert slugId to Int and Find CategoryId
            var slugId = Convert.ToInt32(id);
            var argumentId = _argumentService.GetBySlugId(slugId).id;

            //Get POST of category
            var posts = _postService.GetByArgumentId(argumentId);
            
            //If ARGUMENT are a list show list else only data conneted to this argument
            if(posts.Count > 1){
                return RedirectToAction("List", "Post", new{argumentId = argumentId, pageSize = 50, pageNumber = 1});
            } else if(posts.Count == 1){
                return RedirectToAction("GetByPostId", "Post", new{id = posts[0].id});
            }

            return Json("No Redirect");
        }
    }
}