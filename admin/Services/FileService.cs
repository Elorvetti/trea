using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial class FileService : IFileService
    {
        private readonly IHostingEnvironment _env;

        public FileService(IHostingEnvironment env){
            this._env = env;
        }

        public bool fileExtensionOk(string fileExtension, string[] extensioneSupported){
            return extensioneSupported.Contains(fileExtension);
        }

        public async Task<string> uploadFile(string path, IFormFile file){
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            var f = Path.Combine(p, path);
            var imagePath = Path.Combine(f, file.FileName);
            
            var stream = File.Create(imagePath);
            await file.CopyToAsync(stream);

            stream.Close();
            return imagePath;
        }

        public bool exist(string path, string fileName){
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            var f = Path.Combine(p, path);
            var imagePath = Path.Combine(f, fileName);

            return File.Exists(imagePath);
        }

        public void update(string path, string fileName)
        {
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            var f = Path.Combine(p, path);
            var n = Path.Combine(p, fileName);

            File.Move(f, n);
        }

        public void Delete(string path)
        {
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            var f = Path.Combine(p, path);

            File.Delete(f);
        }

        public string removeSpaceAndSlash (string folderName){
            return folderName.Replace(" ", "-").Replace("/", "-");
        }
        
    }
}