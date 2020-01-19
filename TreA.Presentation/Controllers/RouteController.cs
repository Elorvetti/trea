using System;
using Microsoft.AspNetCore.Mvc;
using TreA.Services.Slug;

namespace TreA.Presentation.Controllers
{
    public class RouteController : Controller
    {

        private readonly ISlugService _slugService;

        public RouteController(ISlugService slugService){
            this._slugService = slugService;
        }

        public IActionResult Index(string category, string argument, string post){
            if(category != null){
                var slug = String.Format("Blog/{0}/", category);
                if(!String.IsNullOrEmpty(argument)){
                    slug =  slug + argument + '/';
                    if(!String.IsNullOrEmpty(post)){
                        slug =  slug + post + '/';
                    }
                }
            
                var entity = _slugService.GetByName(slug).entityname;
                var id = _slugService.GetByName(slug).id;
                return RedirectToActionPermanent("GetById", entity, new {id = id});
            }

            return Json("Errore");
            
        }
    }
}