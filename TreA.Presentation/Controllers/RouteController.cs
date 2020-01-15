using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TreA.Services.Slug;

namespace TreA.Presentation.Controllers
{
    public class RouteController : Controller
    {

        private readonly ISlugService _slugService;

        public RouteController(ISlugService slugService){
            this._slugService = slugService;
        }

        [HttpPost]
        public void Index(string category, string argument){
            var slug = String.Format("/{0}/", category);
            
            if(!String.IsNullOrEmpty(argument)){
                slug =  slug + argument + '/';
            }
            
            var slugId = _slugService.GetByName(slug).id;

        }
    }
}