using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using admin.Data;

namespace admin.Models
{
    public class ArgumentModel : Argument
    {
        public string categoryName { get; set; }
        public IList<categories> categories { get; set; }
    }
    public class categories{
        public int id { get; set; }
        public string name { get; set; }
    }
    
}