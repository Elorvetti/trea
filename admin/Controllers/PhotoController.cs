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
    public partial class PhotoController : Controller
    {
        private readonly IPhotoService _photoService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;


        public PhotoController(IPhotoService photoService, IFolderService folderService, IFileService fileService){
            this._photoService = photoService;
            this._folderService = folderService;
            this._fileService = fileService;
        }

        [Authorize]
        public IActionResult Index(){
            ViewBag.Title = "Foto";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(IList<IFormFile> files){

            var fileExtension = new[] { "image/gif", "image/jpg", "image/jpeg", "image/tiff", "image/png" };

            if(files.Count() > 0)
            {

                var existFolder = _folderService.Exist("Content\\Images");
                if (!existFolder)
                {
                    _folderService.Create("Content\\Images");
                }


                var model = new PhotoModel();
                model.images = files;
                
                foreach(var image in model.images)
                {
                    var fileExtensionOk = _fileService.fileExtensionOk(image.ContentType, fileExtension);
                    if (fileExtensionOk)
                    {
                        var existFile = _fileService.exist("Content\\Images", image);
                        if(!existFile){

                            await _fileService.uploadFile("Content\\Images", image);

                            model.name = image.FileName;
                            model.path = "../App_Data/Content/Images/" + image.FileName;

                            _photoService.Insert(model);
                            
                        }
                    }
                }
            }
            return View();
            
        }

        [HttpPost]
        public IList<Photo> GetAll(){
            return _photoService.GetAll();
        }

        [HttpPost]
        public Photo GetById(int id){
            return _photoService.GetById(id);
        }

    }
}