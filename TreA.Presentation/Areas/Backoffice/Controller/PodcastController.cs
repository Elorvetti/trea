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
using TreA.Presentation.Areas.Backoffice.Models;
using TreA.Data.Entities;
using TreA.Services.Common;
using TreA.Services.Podcast;
using TreA.Services.Folder;
using TreA.Services.Files;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class PodcastController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IPodcastService _podcastService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;

        public PodcastController(ICommonService commonService, IPodcastService podcastService, IFolderService folderService, IFileService fileService){
            this._commonService = commonService;
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

                foreach(var podcast in files)
                {
                    var fileExtensionOk = _fileService.fileExtensionOk(podcast.ContentType, fileExtension);
                    if (fileExtensionOk)
                    {
                        var existFile = _fileService.exist("Content\\Podcast", podcast.FileName);
                        if(!existFile){

                            var model = new PodcastModel();
                            model.name = podcast.FileName;
                            model.path = "/App_Data/Content/Podcast/" + podcast.FileName;
                            _podcastService.Insert(model);

                            await _fileService.uploadFile("Content\\Podcast", podcast);
                            
                        }
                    }
                }
            }
            return View();
            
        }

        [HttpPost]
        public PodcastModel GetAll(int pageSize, int pageNumber){
            var model = new PodcastModel();

            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _podcastService.GetAll().Count;

            model.sectionName = "Photo";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.podcastList = _podcastService.GetAll(excludeRecords, pageSize);
            
            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }

            return model;
        }

        [HttpPost]
        public Podcasts GetById(int id){
            return _podcastService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection form){
            var model = new PodcastModel();

            var podcast = _podcastService.GetById(id);
            var path = podcast.path;

            var ext = Path.GetExtension(path);
            var fileNameFromPost = _commonService.cleanStringPath(form["name"]) + ext;
            var desctiption = form["description"];

            var exist = _fileService.exist("Content\\Podcast\\", fileNameFromPost);
            if (exist)
            {
                var oldFileName = "Content\\Podcast\\" + podcast.name;
                var newFileName = "Content\\Podcast\\" + fileNameFromPost;
                _fileService.update(oldFileName, newFileName);

                model.path = "/App_Data/Content/Podcast/" + fileNameFromPost;
                model.name = fileNameFromPost;
                model.description = desctiption;
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
        
        [HttpPost]
        public PodcastModel Find(string name, int pageSize, int pageNumber){
            var model = new PodcastModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;          
            model.podcastList = _podcastService.Find(name, excludeRecords, pageSize);  
                        
            var total = model.podcastList.Count;
            model.sectionName = "Podcast";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);

            return model;
        }
    }
}