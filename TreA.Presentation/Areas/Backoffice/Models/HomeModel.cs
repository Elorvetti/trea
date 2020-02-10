using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class HomeModel : Homes
    {
        public string headerBackgroundImage { get; set; }
        public string newsletterBackgroundImage { get; set; }
        public IList<CategoryMenu> categoryMenus{ get; set; } = new List<CategoryMenu>();
        public IList<ArgumentMenu> argumentMenus { get; set; } = new List<ArgumentMenu>();
        
    }
    public class CategoryMenu : Categories{
        public bool HasChild{ get; set; }
    }

    public class ArgumentMenu : Arguments{
        public bool HasChild{ get; set; }
    }
}