using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Arguments
    {
        public int id { get; set; }
        public string name { get; set; }
        public string slug { get; set; }
        public string description { get; set; }
        public int categoryId { get; set; }
        public Categories category{ get; set; }

    }
}