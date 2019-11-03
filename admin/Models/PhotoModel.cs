using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using admin.Data;

namespace admin.Models
{
    public class PhotoModel : Photo
    {
        public IList<IFormFile> images { get; set; }
    }
}