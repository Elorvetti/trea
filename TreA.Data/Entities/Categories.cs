using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Categories  
    {
        public int id { get; set; }
        public string name { get; set; }
        public int slugId { get; set; }
        public int displayOrder { get; set; }
        public string description { get; set; }

    }
}
