using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using TreA.Services.Slug;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;

namespace TreA.Presentation.Controllers
{
    public class BlogController : Controller
    {
        private readonly ISlugService _slugService;
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        public BlogController(ISlugService slugService, ICategoryService categoryService, IArgumentService argumentService, IPostService postService){
            this._slugService = slugService;
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
        }

        public void Index(){
            var rewriteUrl = new RewriteUrl(_categoryService, _argumentService, _postService, _slugService);
            var context = new RewriteContext();
            context.HttpContext = this.HttpContext;
            rewriteUrl.ApplyRule(context);
        }
    }
}