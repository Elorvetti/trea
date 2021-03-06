using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class AddAdministratorModel : AdministratorModel
    {
        [Required(ErrorMessage = "Il campo Conferma Password è obbligatorio")]
        [DataType(DataType.Password)]
        [Display(Name = "Conferma Password")]
        public string ConfirmPassword { get; set; }

    }
}