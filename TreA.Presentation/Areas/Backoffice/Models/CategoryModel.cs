using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class CategoryModel: Categories
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Categories> categories{ get; set; }
        public IList<ArgumentChild> Children { get; set; } = new List<ArgumentChild>();
    }

    public class ArgumentChild : Arguments{
        public string slug{ get; set; }
    }
}