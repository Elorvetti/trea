using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Video
    {
        public int id { get; set; }
        public string name { get; set; }
        public string path { get; set; }
    }
}