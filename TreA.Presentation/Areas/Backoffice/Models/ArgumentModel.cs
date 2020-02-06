using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class ArgumentModel : Arguments
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public string slug { get; set; }
        public IList<Arguments> arguments { get; set; } = new List<Arguments>();
        public IList<Categories> categories{ get; set; } = new List<Categories>();
        public IList<Posts> posts{ get; set; } = new List<Posts>();
    }
}