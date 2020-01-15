using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TreA.Presentation.Controllers
{
    public class RouteController : Controller
    {
        [HttpPost]
        public void Index(string name){
            var a = name.Split("/");
            var b = a.Where(x => !String.IsNullOrEmpty(x)).ToArray();

            
        }
    }
}