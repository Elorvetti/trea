using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Album
    {
        public int id { get; set; }
        public string idImmagini { get; set; }
        public string idVideo { get; set; }
    }
}