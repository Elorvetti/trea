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
using TreA.Services.Post;

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
        private readonly IPostService _postService;

        public PhotoController(ICommonService commonService, IPhotoService photoService, IPhotoFolderService photoFolderService, IAlbumService albumService, IFolderService folderService, IFileService fileService, IUserService userService, IHomeService homeService, IArgumentService argumentService, IPostService postService){
            this._commonService = commonService;
            this._photoService = photoService;
            this._photoFolderService = photoFolderService;
            this._albumService = albumService;
            this._folderService = folderService;
            this._fileService = fileService;
            this._userService = userService;
            this._homeService = homeService;
            this._argumentService = argumentService;
            this._postService = postService;
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
            
            model.folderId = id;
            model.photos = _photoService.GetByFolderId(id);
            
            foreach(var photo in model.photos){
                var admins = _userService.GetByPhotoId(photo.id);
                var arguments = _argumentService.GetByCoverImageId(photo.id);
                var posts = _postService.GetByCoverImage(photo.id);
                var home = _homeService.GetImageUsage(photo.id);

                var total = admins.Count + arguments.Count + posts.Count;
                if(home != null){
                    if(home.headerImageId == photo.id && home.newsletterImageId == photo.id){
                        total = total + 2;
                    } else if(home.headerImageId == photo.id){
                        total = total + 1;
                    } else if(home.newsletterImageId == photo.id){
                        total = total + 1;
                    }
                }


                model.photosUsed.Add(total);
            }

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
        public IList<PhotoUsageModel> CheckUsageImage(int id){
            var model = new List<PhotoUsageModel>();

            var admins = _userService.GetByPhotoId(id);
            foreach(var admin in admins){
                model.Add(new PhotoUsageModel(){
                    name = string.Concat("Utente: ", admin.user),
                    url = string.Concat("/Backoffice/User/Index?id="  ,admin.id)
                });
            }

            var arguments = _argumentService.GetByCoverImageId(id);
            foreach(var argument in arguments){
                model.Add(new PhotoUsageModel() {
                    name = string.Concat("Argomento: ", argument.name),
                    url = string.Concat("/Backoffice/SiteTree/Index?type=argument&id=", argument.id)
                });
            }

            var posts = _postService.GetByCoverImage(id);
            foreach(var post in posts){
                model.Add(new PhotoUsageModel() {
                    name = string.Concat("Post: ", post.title),
                    url = string.Concat("/Backoffice/SiteTree/index?type=post&id=", post.id)
                });
            }

            var home = _homeService.GetImageUsage(id);
            if(home != null){
                model.Add(new PhotoUsageModel() {
                    name = "HomePage",
                    url = string.Concat("/Backoffice/Home")
                });
            }

            return model;
        }

        [HttpPost]
        public void Delete(int id){
            var photo = _photoService.GetById(id);
            var folderName = _commonService.cleanStringPath(_photoFolderService.GetById(photo.folderId).name);
            
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