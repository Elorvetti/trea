using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial class LoginService: ILoginService
    {
        private readonly TreAContext _ctx;

        public LoginService(TreAContext ctx)
        {
            _ctx = ctx;
        }

        public bool IsAdmin(AdministratorModel model)
        {
            var admin = _ctx.administrator.Where(c => c.user == model.Email && c.password == model.Password && c.IsActive);
            if(admin.Any())
            {
                return true;
            }
            return false;
        }

    }
}