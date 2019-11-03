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
    public partial class FileService : IFileService
    {
        public bool fileExtensionOk(string fileExtension, string[] extensioneSupported){
            return extensioneSupported.Contains(fileExtension);
        }
    }
}