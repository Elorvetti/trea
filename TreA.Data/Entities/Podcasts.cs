using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Podcasts
    {
        public int id { get; set; }
        public string name { get; set; }
        public string path { get; set; }
    }
}