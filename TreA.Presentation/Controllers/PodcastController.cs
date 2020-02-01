using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TreA.Presentation.Models;
using TreA.Data.Entities;
using TreA.Services.Podcast;

namespace TreA.Presentation.Controllers
{
    public class PodcastController : Controller
    {
        private readonly IPodcastService _podcastService;

        public PodcastController(IPodcastService podcastService){
            this._podcastService = podcastService;
        }

        public IActionResult Index(){
            var model = new PodcastModel();
            model.podcasts = _podcastService.GetAll();

            return View(model);
        }

        public IActionResult List(){
            var model = new PodcastModel();
            model.podcasts = _podcastService.GetAll();

            return View(model);
        }

        [HttpPost]
        public Podcasts GetById(int id){
            return _podcastService.GetById(id);
        }
    }
}