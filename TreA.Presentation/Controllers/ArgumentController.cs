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
                    title = argument.name,
                    descrizione = argument.description.Length > 200 ? argument.description.Substring(0, 200) : argument.description
                });
            }

            return View(model);
        }
        public ArgumentModel List(int categoryId, int pageSize, int pageNumber){      
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

            return model;
        }
    }
}