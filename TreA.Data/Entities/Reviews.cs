using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Reviews
    {
        public int id { get; set; }
        public int postId { get; set; }
        public string nome { get; set; }
        [EmailAddress]
        public string email{ get; set; }
        public string titolo{ get; set; }
        public string testo{ get; set; }
        public bool acepted { get; set; }
        public DateTime insertDate { get; set; }
    }
}