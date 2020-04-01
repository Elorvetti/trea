using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class PhotoModel : Photos{
        public IList<IFormFile> images { get; set; }
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Photos> photos { get; set; } = new List<Photos>();
        public IList<int> photosUsed { get; set; } = new List<int>();
        public IList<PhotoUsageModel> photosUsage{ get; set; } = new List<PhotoUsageModel>();
        public int totalUsed { get; set; }
    }

    public class PhotoUsageModel {
        public string name { get; set; }
        public string url { get; set; }
    }
}