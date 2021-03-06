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

namespace TreA.Services.Folder
{
    public partial class FolderService : IFolderService
    {
        private readonly IHostingEnvironment _env;

        public FolderService(IHostingEnvironment env){
            this._env = env;
        }

        public bool Exist(string folderName){
            var C = Path.Combine(_env.ContentRootPath, "App_Data");

           string folder = Path.Combine(C, folderName);
            if(Directory.Exists(folder)){
                return true;
            }
            return false;
        }

        public void Create(string folderName){
            var C = Path.Combine(_env.ContentRootPath, "App_Data");
            string folder = Path.Combine(C, folderName);
            Directory.CreateDirectory(folder);
        }

        public void Update(string folderName, string newFoldeName){
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            string folder = Path.Combine(p, folderName);
            string folderNewName = Path.Combine(p, newFoldeName);
            Directory.Move(folder, folderNewName);
        }

        public void Rename(string folderName, string newFoldeName){
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            string folder = Path.Combine(p, folderName);
            string folderNewName = Path.Combine(p, newFoldeName);
            Directory.Move(folder, folderNewName);
        }

        public void Delete(string folderName){
            var C = Path.Combine(_env.ContentRootPath, "App_Data");
            string folder = Path.Combine(C, folderName);
            Directory.Delete(folder);
        }

        public string removeSpaceAndSlash (string folderName){
            return folderName.Replace(" ", "-").Replace("/", "-");
        }

        public string formatPath(string folderName){
            var path = "\\" + folderName;
            return path;
        }

    }
}