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
        private readonly ICommonService _commonService;
        private readonly IPhotoService _photoService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;
        private readonly IUserService _userService;


        public PhotoController(ICommonService commonService, IPhotoService photoService, IFolderService folderService, IFileService fileService, IUserService userService){
            this._commonService = commonService;
            this._photoService = photoService;
            this._folderService = folderService;
            this._fileService = fileService;
            this._userService = userService;
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
                        var existFile = _fileService.exist("Content\\Images", image.FileName);
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

        [HttpPost]
        public void Update(int id, IFormCollection form){
            var model = new PhotoModel();

            var photo = _photoService.GetById(id);
            var path = photo.path;

            var ext = Path.GetExtension(path);
            var fileNameFromPost = _commonService.cleanStringPath(form["name"]) + ext;

            var exist = _fileService.exist("Content\\Images\\", fileNameFromPost);
            if (!exist)
            {
                var oldFileName = "Content\\Images\\" + photo.name;
                var newFileName = "Content\\Images\\" + fileNameFromPost;
                _fileService.update(oldFileName, newFileName);

                model.path = "../App_Data/Content/Images/" + fileNameFromPost;
                model.name = fileNameFromPost;
                _photoService.Update(id, model);
            }

        }

        [HttpPost]
        public void Delete(int id){
            var photo = _photoService.GetById(id);

            //remove avatar photo
            var admins = _userService.GetByPhotoId(id);
            foreach(var admin in admins)
            {
                admin.photoId = 0;
            }

            var filePath = "Content\\Images\\" + photo.name;
            _fileService.Delete(filePath);
            _photoService.Delete(id);
            
        }

    }
}