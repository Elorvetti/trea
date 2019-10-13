using Microsoft.AspNetCore.Identity;

namespace admin.Data
{
    public class Administrator : IdentityUser
    {
        public int id { get; set; }
        public string user { get; set; }
        public string password { get; set; }
    }
}