using System;
using System.IO;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace TreA.Services.Files
{
    public partial class FileService : IFileService
    {
        private readonly IHostingEnvironment _env;
        private readonly System.Drawing.Imaging.Encoder Transformation;

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
        
        public void UploadImage(string path, string fileName, Image image){
            var p = Path.Combine(_env.ContentRootPath, "App_Data");
            var f = Path.Combine(p, path);
            var imagePath = Path.Combine(f, fileName);
            

            var myEncoder = Encoder.Quality;
            var myImageCodecInfo = GetEncoderInfo("image/jpeg");

            var myEncoderParameters = new EncoderParameters(1);
            var myEncoderParameter = new EncoderParameter(myEncoder, 75L);
            myEncoderParameters.Param[0] = myEncoderParameter;
            image.Save(imagePath, myImageCodecInfo, myEncoderParameters);
        }

        private static ImageCodecInfo GetEncoderInfo(String mimeType)
        {
            int j;
            ImageCodecInfo[] encoders;
            encoders = ImageCodecInfo.GetImageEncoders();
            for(j = 0; j < encoders.Length; ++j)
            {
                if(encoders[j].MimeType == mimeType)
                    return encoders[j];
            }
            return null;
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
    }
}