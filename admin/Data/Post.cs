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
        public string testo { get; set; }
        public bool pubblico { get; set; }
        public bool isArgument { get; set; }

        public int argumentId { get; set; }
        public Argument argument { get; set; }
    }
}