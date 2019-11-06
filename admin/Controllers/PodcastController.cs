using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using admin.Data;
using admin.Models;
using admin.Services;

namespace admin.Controllers
{
    public partial class PodcastController : Controller
    {
        private readonly IPodcastService _podcastService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;

        public PodcastController(IPodcastService podcastService, IFolderService folderService, IFileService fileService){
            this._podcastService = podcastService;
            this._folderService = folderService;
            this._fileService = fileService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Podcast";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(IList<IFormFile> files){
            var fileExtension = new[] {"audio/mp3", "audio/mpeg", "audio/ogg", "audio/wav"};

            if(files.Count() > 0)
            {

                var existFolder = _folderService.Exist("Content\\Podcast");
                if (!existFolder)
                {
                    _folderService.Create("Content\\Podcast");
                }

                var model = new PodcastModel();
                model.podcasts = files;
                
                foreach(var podcast in model.podcasts)
                {
                    var fileExtensionOk = _fileService.fileExtensionOk(podcast.ContentType, fileExtension);
                    if (fileExtensionOk)
                    {
                        var existFile = _fileService.exist("Content\\Podcast", podcast.FileName);
                        if(!existFile){

                            await _fileService.uploadFile("Content\\Podcast", podcast);

                            model.name = podcast.FileName;
                            model.path = "../App_Data/Content/Podcast/" + podcast.FileName;

                            _podcastService.Insert(model);
                            
                        }
                    }
                }
            }
            return View();
            
        }

        [HttpPost]
        public IList<Podcast> GetAll(){
            return _podcastService.GetAll();
        }

        [HttpPost]
        public Podcast GetById(int id){
            return _podcastService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection form){
            var model = new PodcastModel();

            var podcast = _podcastService.GetById(id);
            var path = podcast.path;

            var ext = Path.GetExtension(path);
            var fileNameFromPost = _fileService.removeSpaceAndSlash(form["name"]) + ext;

            var exist = _fileService.exist("Content\\Podcast\\", fileNameFromPost);
            if (!exist)
            {
                var oldFileName = "Content\\Podcast\\" + podcast.name;
                var newFileName = "Content\\Podcast\\" + fileNameFromPost;
                _fileService.update(oldFileName, newFileName);

                model.path = "../App_Data/Content/Podcast/" + fileNameFromPost;
                model.name = fileNameFromPost;
                _podcastService.Update(id, model);
            }

        }

        [HttpPost]
        public void Delete(int id){
            var podcast = _podcastService.GetById(id);

            var filePath = "Content\\Podcast\\" + podcast.name;
            _fileService.Delete(filePath);
            _podcastService.Delete(id);
            
        }
    }
}