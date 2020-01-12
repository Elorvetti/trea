using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public partial class UserModel : Administrators{
        public string photoPath { get; set; }
    }
}
