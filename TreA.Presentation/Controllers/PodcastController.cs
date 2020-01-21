using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TreA.Presentation.Controllers
{
    public class PodcastController : Controller
    {
        public IActionResult Index(){
            return View();
        }
    }
}