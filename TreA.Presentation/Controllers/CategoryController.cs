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
    }
}