using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using TreA.Presentation.Areas.Backoffice.Models;
using TreA.Data.Entities;
using TreA.Services.Common;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Slug;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public class SiteTreeController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly ISlugService _slugService;

        
        public SiteTreeController(ICommonService commonService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService, ISlugService slugService){
            this._commonService = commonService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Alberatura sito";

            return View();
        }

        
        [HttpPost]
        public Categories GetCategoryChildId(int id, int idPadre){
            var model = new CategoryModel();

            model.id = id;
            model.arguments = _argumentService.GetByCategoryId(id, 1, idPadre);
            model.posts = _postService.GetAllByCategoryId(id);
            return model;
        }



    }
}