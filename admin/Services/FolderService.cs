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
using admin.Models;
using admin.Data;

namespace admin.Services
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

    }
}