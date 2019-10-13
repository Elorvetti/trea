using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace admin.Models
{
    public class AdministratorModel
    {
        [Required(ErrorMessage = "Il campo Email è obbligatorio")]
        [EmailAddress(ErrorMessage = "Il formato Email non è valido")]
        [Display(Name = "Email")]
        public string email { get; set; }

        [Required(ErrorMessage = "Il campo Password è obbligatorio")]
        [Display(Name = "Password")]
        public string password { get; set; }

    }
}