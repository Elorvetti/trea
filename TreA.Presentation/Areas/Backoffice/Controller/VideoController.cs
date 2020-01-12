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
using TreA.Services.Video;
using TreA.Services.Folder;
using TreA.Services.Files;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class VideoController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IVideoService _videoService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;

        public VideoController(ICommonService commonService, IVideoService videoService, IFolderService folderService, IFileService fileService){
            this._commonService = commonService;
            this._videoService = videoService;
            this._folderService = folderService;
            this._fileService = fileService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Video";

            return View();
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 309715200)]
        [RequestSizeLimit(309715200)]
        public async Task<IActionResult> Index(IList<IFormFile> files){
            var fileExtension = new[] { "video/mp4", "video/ogg", "video/3gp", "video/wmv", "video/webm", "video/flv" };

            if(files.Count() > 0)
            {

                var existFolder = _folderService.Exist("Content\\Videos");
                if (!existFolder)
                {
                    _folderService.Create("Content\\Videos");
                }


                var model = new VideoModel();
                model.videos = files;
                
                foreach(var video in model.videos)
                {
                    var fileExtensionOk = _fileService.fileExtensionOk(video.ContentType, fileExtension);
                    if (fileExtensionOk)
                    {
                        var existFile = _fileService.exist("Content\\Videos", video.FileName);
                        if(!existFile){

                            await _fileService.uploadFile("Content\\Videos", video);

                            model.name = video.FileName;
                            model.path = "../App_Data/Content/Videos/" + video.FileName;

                            _videoService.Insert(model);
                            
                        }
                    }
                }
            }
            return View();
            
        }

        [HttpPost]
        public VideoModel GetAll(int pageSize, int pageNumber){
            var model = new VideoModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _videoService.GetAll().Count;
            
            model.sectionName = "Video";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.videoList = _videoService.GetAll(excludeRecords, pageSize);

            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }
            
            return model;
        }

        [HttpPost]
        public Videos GetById(int id){
            return _videoService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection form){
            var model = new VideoModel();

            var video = _videoService.GetById(id);
            var path = video.path;

            var ext = Path.GetExtension(path);
            var fileNameFromPost = _commonService.cleanStringPath(form["name"]) + ext;

            var exist = _fileService.exist("Content\\Videos\\", fileNameFromPost);
            if (!exist)
            {
                var oldFileName = "Content\\Videos\\" + video.name;
                var newFileName = "Content\\Videos\\" + fileNameFromPost;
                _fileService.update(oldFileName, newFileName);

                model.path = "../App_Data/Content/Videos/" + fileNameFromPost;
                model.name = fileNameFromPost;
                _videoService.Update(id, model);
            }

        }

        [HttpPost]
        public void Delete(int id){
            var video = _videoService.GetById(id);

            var filePath = "Content\\Videos\\" + video.name;
            _fileService.Delete(filePath);
            _videoService.Delete(id);
            
        }
    }
}