using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace TreA.Services.Files
{
    public partial interface IFileService
    {
        bool fileExtensionOk(string fileExtension, string[] extensioneSupported);
        Task<string> uploadFile(string path, IFormFile file);
        bool exist(string path, string file);
        void update(string path, string fileName);
        void Delete(string path);
    }
}