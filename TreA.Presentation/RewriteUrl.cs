using System;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using TreA.Data;
using TreA.Data.Entities;
using TreA.Services.Category;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Slug;

namespace TreA.Presentation 
{
    public class RewriteUrl : Microsoft.AspNetCore.Rewrite.IRule
    {
        private readonly ICategoryService _categoryService;
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly ISlugService _slugService;
        public int StatusCode { get; } = 302;

        public RewriteUrl(ICategoryService categoryService,IArgumentService argumentService, IPostService postService, ISlugService slugService){
            this._categoryService = categoryService;
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
        }

        public void ApplyRule(RewriteContext context){
            var NewUrl = "";
            var request = context.HttpContext.Request;
            var host = request.Host;
            var slug = request.QueryString.Value.Replace("?param=", "/Blog/");
                    
            var entity = _slugService.GetByName(slug).entityname;
            var id = _slugService.GetByName(slug).id;

            if(entity == "Category"){
                var categoryId = _categoryService.GetBySlugId(id).id;
                var arguments = _argumentService.GetByCategoryId(categoryId);

                NewUrl = request.Scheme + "://" + host + "/Argument/List?categoryId=" + categoryId + "&PageSize=50&PageNumber=1";  

            } else if(entity == "Argument"){
                var argumentId = _argumentService.GetBySlugId(id).id;
                var posts = _postService.GetByArgumentId(argumentId);
                
                if(posts.Count > 1){
                    NewUrl = request.Scheme + "://" + host + "/Post/List?argumentId=" + argumentId + "&PageSize=50&PageNumber=1";
                } else {
                    NewUrl = request.Scheme + "://" + host + "/Post/GetByPostId/" + posts[0].id;  
                }
            } else {
                var postId = _postService.GetBySlugId(id).id;
                NewUrl = request.Scheme + "://" + host + "/Post/GetByPostId/" + postId;  
            }

            var response = context.HttpContext.Response;
            response.StatusCode = StatusCode;
            response.Headers[HeaderNames.Location] = NewUrl;

        }
    }
}