using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Administrators
    {
        public int id { get; set; }
        public string user { get; set; }
        public string password { get; set; }
        public bool IsActive { get; set; }
        public bool rememberMe { get; set; }
        public int photoId { get; set; }
    }
}