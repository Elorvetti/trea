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
        
    }
}