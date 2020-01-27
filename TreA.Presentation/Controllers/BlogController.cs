using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using TreA.Services.Slug;

namespace TreA.Presentation.Controllers
{
    public class BlogController : Controller
    {
        private readonly ISlugService _slugService;
        public BlogController(ISlugService slugService){
            this._slugService = slugService;
        }

        public IActionResult Index(){
            var slug = this.HttpContext.Request.Path.Value;
            
            var entity = _slugService.GetByName(slug).entityname;
            var id = _slugService.GetByName(slug).id;
            return RedirectToAction("GetBySlugId", entity, new {id = id, slug = slug});

        }
    }
}