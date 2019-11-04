using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using admin.Data;

namespace admin.Models
{
    public class VideoModel : Video
    {
        public IList<IFormFile> videos { get; set; }
    }
}