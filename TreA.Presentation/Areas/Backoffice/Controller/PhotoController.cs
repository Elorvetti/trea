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
using TreA.Services.Photo;
using TreA.Services.PhotoFolder;
using TreA.Services.Album;
using TreA.Services.Folder;
using TreA.Services.Files;
using TreA.Services.User;
using TreA.Services.Home;
using TreA.Services.Argument;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class PhotoController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IPhotoService _photoService;
        private readonly IPhotoFolderService _photoFolderService;
        private readonly IAlbumService _albumService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;
        private readonly IUserService _userService;
        private readonly IHomeService _homeService;
        private readonly IArgumentService _argumentService;

        public PhotoController(ICommonService commonService, IPhotoService photoService, IPhotoFolderService photoFolderService, IAlbumService albumService, IFolderService folderService, IFileService fileService, IUserService userService, IHomeService homeService, IArgumentService argumentService){
            this._commonService = commonService;
            this._photoService = photoService;
            this._photoFolderService = photoFolderService;
            this._albumService = albumService;
            this._folderService = folderService;
            this._fileService = fileService;
            this._userService = userService;
            this._homeService = homeService;
            this._argumentService = argumentService;
        }

        [Authorize]
        [HttpPost]
        public FolderModel GetAllFolder(){
            var model = new FolderModel();

            model.folders = _photoFolderService.GetAll(); 
            
            return model;
        }

        [HttpPost]
        public void AddFolder(IFormCollection folder){
            var model = new FolderModel();

            model.name = folder["name"];
            var nameClean = _commonService.cleanStringPath(model.name);
            model.path = string.Concat("Content/Images/",nameClean);
            var existFolder = _folderService.Exist(string.Concat("Content\\Images\\", nameClean));
            if (!existFolder)
            {
                _folderService.Create(string.Concat("Content\\Images\\", nameClean));
            }

            _photoFolderService.Insert(model);
        }

        [HttpPost]
        public PhotoFolders GetFolderById(int id){
            return _photoFolderService.GetById(id);
        }

        [HttpPost]
        public void UpdateFolder(int id, IFormCollection folder){
            var model = new PhotoFolders();
            
            model.name = folder["name"];
            var folderNameClean = _commonService.cleanStringPath(model.name);
            var path = _photoFolderService.GetById(id).path;
            var oldPath = path.Split('/').Where(x => !string.IsNullOrEmpty(x)).ToArray();
            var newPath = path.Replace(oldPath[oldPath.Length - 1], folderNameClean);
            
            model.path = newPath;
            _photoFolderService.Update(id, model);
            _folderService.Update(path.Replace('/', '\\'), string.Concat("Content\\Images\\",folderNameClean));
        }

        public PhotoModel GetPhotoByFolderId(int id){
            var model = new PhotoModel();
            
            model.photos = _photoService.GetByFolderId(id);
            model.folderId = id;
            return model;
        }

        public IActionResult Index(){
            ViewBag.Title = "Foto";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(IList<IFormFile> files, IFormCollection data){

            var fileExtension = new[] { "image/gif", "image/jpg", "image/jpeg", "image/tiff", "image/png" };
            var folderId = Convert.ToInt32(data["folderId"]);
            var folderName = _photoFolderService.GetById(folderId).name;

            if(files.Count() > 0)
            {
                var existFolder = _folderService.Exist(string.Concat("Content\\Images\\", folderName));
                if (!existFolder)
                {
                    _folderService.Create(string.Concat("Content\\Images\\", folderName));
                }

                var model = new PhotoModel();
                model.images = files;
                
                foreach(var image in model.images)
                {
                    var fileExtensionOk = _fileService.fileExtensionOk(image.ContentType, fileExtension);
                    if (fileExtensionOk)
                    {
                        var existFile = _fileService.exist(string.Concat("Content\\Images\\", folderName, "\\"), image.FileName);
                        if(!existFile){

                            await _fileService.uploadFile(string.Concat("Content\\Images\\", folderName), image);

                            model.name = image.FileName;
                            model.path = string.Concat("/App_Data/Content/Images/", folderName, "/", image.FileName);
                            model.folderId = folderId;
                            _photoService.Insert(model);
                        }
                    }
                }
            }
            return View();
            
        }

        [HttpPost]
        public PhotoModel GetAll(int pageSize, int pageNumber){
            var model = new PhotoModel();

            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _photoService.GetAll().Count;

            model.sectionName = "Photo";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            model.photos = _photoService.GetAll(excludeRecords, pageSize);
            
            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }

            return model;
        }

        [HttpPost]
        public Photos GetById(int id){
            return _photoService.GetById(id);
        }

        [HttpPost]
        public void Update(int id, IFormCollection form){
            var model = new PhotoModel();

            var photo = _photoService.GetById(id);
            var path = photo.path;

            var ext = Path.GetExtension(path);
            var fileNameFromPost = _commonService.cleanStringPath(form["name"]) + ext;
            var folderId = Convert.ToInt32(form["folderId"]);
            var folderName =  _commonService.cleanStringPath(_photoFolderService.GetById(folderId).name);
            var exist = _fileService.exist(string.Concat("Content\\Images\\", folderName, "\\"), fileNameFromPost);
            if (!exist)
            {
                var oldFileName = string.Concat("Content\\Images\\", folderName, "\\", photo.name);
                var newFileName = string.Concat("Content\\Images\\", folderName, "\\", fileNameFromPost);
                _fileService.update(oldFileName, newFileName);

                model.path = string.Concat("/App_Data/Content/Images/", folderName, '/', fileNameFromPost);
                model.name = fileNameFromPost;
                _photoService.Update(id, model);
            }

        }

        [HttpPost]
        public void Delete(int id){
            if(id != 5){
                var photo = _photoService.GetById(id);
                var folderName = _commonService.cleanStringPath(_photoFolderService.GetById(photo.folderId).name);
            
                //remove avatar photo
                var admins = _userService.GetByPhotoId(id);
                foreach(var admin in admins)
                {
                    admin.photoId = 0;
                }
            
                //remove cover image from argument
                var arguments = _argumentService.GetByCoverImageId(id);
                foreach(var argument in arguments){
                    argument.coverImageId = 5;
                    _argumentService.Update(argument.id, argument);
                }
                
                //remove photo from home
                var homeSetting = _homeService.GetSetting();
                if(homeSetting.headerImageId == id && homeSetting.newsletterImageId == id ){
                    _homeService.UpdateImageOnDelete(5, 5);
                } else if( homeSetting.headerImageId == id ){
                    _homeService.UpdateImageOnDelete(5, homeSetting.newsletterImageId);
                } else if(homeSetting.newsletterImageId == id){
                    _homeService.UpdateImageOnDelete(homeSetting.headerImageId, 5);
                }

                //remove photo from album
                var albums = _albumService.GetAll();
                foreach(var album in albums){
                    var images = album.idImmagini.Split('|').Where(x => x != id.ToString()).ToArray();
                    var newAlbumImages = "";
                    foreach(var image in images){
                        newAlbumImages = string.Concat(newAlbumImages, image, "|");
                    }
                    var newAlbum = new AlbumModel();
                    if(newAlbumImages.Length > 0){
                        newAlbum.idImmagini = newAlbumImages.Remove(newAlbumImages.Length - 1);
                    } else {
                        newAlbum.idImmagini = "";
                    }
                    newAlbum.idVideo = album.idVideo;
                    _albumService.Update(album.id, newAlbum);
                }

                var filePath = string.Concat("Content\\Images\\", folderName, "\\", photo.name);
                _fileService.Delete(filePath);
                _photoService.Delete(id);
            }
            
        }

        [HttpPost]
        public PhotoModel Find(string name, int pageSize, int pageNumber){
            var model = new PhotoModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;          
            model.photos = _photoService.Find(name, excludeRecords, pageSize);  
                        
            var total = model.photos.Count;
            model.sectionName = "Photo";
            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);

            return model;
        }
    }
}