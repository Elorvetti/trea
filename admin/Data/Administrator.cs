using System;
using System.Collections.Generic;

namespace admin.Data
{
    public partial class Administrator
    {
        public int id { get; set; }
        public string user { get; set; }
        public string password { get; set; }
        public bool IsActive { get; set; }
        public bool rememberMe { get; set; }
    }
}