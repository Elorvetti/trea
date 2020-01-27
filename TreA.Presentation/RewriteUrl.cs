using System;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using TreA.Data;
using TreA.Data.Entities;
using TreA.Services.Argument;
using TreA.Services.Post;
using TreA.Services.Slug;

namespace TreA.Presentation 
{
    public class RewriteUrl : Microsoft.AspNetCore.Rewrite.IRule
    {
        private readonly IArgumentService _argumentService;
        private readonly IPostService _postService;
        private readonly ISlugService _slugService;
        private readonly TreAContext _ctx;
        public int StatusCode { get; } = 302;

        public RewriteUrl(IArgumentService argumentService, IPostService postService, ISlugService slugService, TreAContext ctx){
            this._argumentService = argumentService;
            this._postService = postService;
            this._slugService = slugService;
            this._ctx = ctx;
        }

        public void ApplyRule(RewriteContext context){
            var id = 0;
            var request = context.HttpContext.Request;

            if(request.Path.Value.Contains("List")){
                var queryParameters = request.QueryString.Value.Replace("?","").Split("&");
             
                if(queryParameters[0].Contains("argumentId=")){
                    id = Convert.ToInt32(queryParameters[0].Replace("argumentId=", ""));
                }  

                if(id > 0){
                    //var slugId = _argumentService.GetById(id).slugId;
                    //var slug = _slugService.GetById(slugId).name;
                }
                
                var host = request.Host;
                
                string newPath = request.Scheme + "://www." + request.Path.Value;

                var response = context.HttpContext.Response;
                response.StatusCode = StatusCode;
               // response.Headers[HeaderNames.Location] = newPath;

            } 
        }
    }
}