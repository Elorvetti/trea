using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace admin.Data
{
    public partial class Category
    {
        public int id { get; set; }
        public string name { get; set; }
        public int displayOrder { get; set; }

        public List<Argument> arguments { get; set; }
    }
}
