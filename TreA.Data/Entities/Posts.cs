using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Posts
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

        public DateTime dateInsert { get; set; }
    }
}