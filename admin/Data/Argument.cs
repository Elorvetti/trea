using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Argument
    {
        public int id { get; set; }
        public int idFather { get; set; }
        public int level { get; set; }
        public string name { get; set; }
        public string path { get; set; }
    }
}