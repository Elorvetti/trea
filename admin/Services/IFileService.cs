using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using admin.Models;
using admin.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace admin.Services
{
    public partial interface IFileService
    {
        bool fileExtensionOk(string fileExtension, string[] extensioneSupported);
        Task<string> uploadFile(string path, IFormFile file);
        bool exist(string path, IFormFile file);

    }
}