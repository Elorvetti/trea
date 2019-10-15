using Microsoft.AspNetCore.Identity;

namespace admin.Data
{
    public class Administrator
    {
        public int id { get; set; }
        public string user { get; set; }
        public string password { get; set; }
        public bool IsActive { get; set; }
        public bool rememberMe { get; set; }
    }
}