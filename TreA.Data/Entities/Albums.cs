using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Albums
    {
        public int id { get; set; }
        public string idImmagini { get; set; }
        public string idVideo { get; set; }
    }
}