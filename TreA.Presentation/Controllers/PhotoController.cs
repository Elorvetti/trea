using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TreA.Presentation.Controllers
{
    public class PhotoController : Controller
    {
        public IActionResult Index(){
            return View();
        }
    }
}