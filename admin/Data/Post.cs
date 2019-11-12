using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Post
    {
        public int id { get; set; }
        public int idArgument { get; set; }
        public int idTemplate { get; set; }
        public int idAlbum { get; set; }
        public string idImmagini { get; set; }
        public string title { get; set; }
        public string subtitle { get; set; }
        public string testo { get; set; }
    }
}