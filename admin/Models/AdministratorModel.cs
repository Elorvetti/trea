using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using admin.Data;

namespace admin.Models
{
    public class AdministratorModel : Administrator
    {
        [Required(ErrorMessage = "Il campo Email è obbligatorio")]
        [EmailAddress(ErrorMessage = "Il formato Email non è valido")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Il campo Password è obbligatorio")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name="Rember me")]
        public bool RememberMe { get; set; }

        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Administrator> administrators{ get; set; }

    }
}