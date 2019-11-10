using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using admin.Data;

namespace admin.Models
{
    public partial class UserModel : Administrator{
        public string photoPath { get; set; }
    }
}
