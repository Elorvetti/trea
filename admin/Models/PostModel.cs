using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using admin.Data;

namespace admin.Models
{
    public class PostModel : Post
    {
        public IList<Argument> argument { get; set; }
        public Album album { get; set; }
    }    
}