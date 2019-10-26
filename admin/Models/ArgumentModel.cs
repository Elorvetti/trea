using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace admin.Models
{
    public class ArgumentModel
    {
        [Required(ErrorMessage = "Il Campo Nome è obbligatorio")]
        [Display(Name = "Nome")]
        public string Path { get; set; }
        
    }
}