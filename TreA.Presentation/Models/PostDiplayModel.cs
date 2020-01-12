using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class PostDisplayModel 
    {
        public int id { get; set; }
        public string slug { get; set; }
        public string coverImage{ get; set; }
        public string title { get; set; }
        public string testo { get; set; }
    }
}