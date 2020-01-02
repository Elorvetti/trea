using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Post
    {
        public int id { get; set; }
        public int albumId { get; set; }
        public string title { get; set; }

        public string slug { get; set; }
        public string testo { get; set; }
        public bool pubblico { get; set; }
        public int categoryId { get; set; }
        public int argumentId { get; set; }
        public int PhotoId { get; set; }
    }
}