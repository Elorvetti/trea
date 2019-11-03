using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Photo
    {
        public int id { get; set; }
        public string name { get; set; }
        public string path { get; set; }
    }
}