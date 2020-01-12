using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class NewsletterModel
    {
        [Required]
        [Display(Name="Nome")]
        public string name { get; set; }
        [Required]
        [Display(Name="Email")]
        public string email { get; set; }
        public string backgroundImage { get; set; }
    }
}