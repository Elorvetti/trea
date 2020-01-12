using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Login
{
    public partial class LoginService: ILoginService
    {
        private readonly TreAContext _ctx;

        public LoginService(TreAContext ctx)
        {
            _ctx = ctx;
        }

        public bool IsAdmin(Administrators model)
        {
            var admin = _ctx.administrator.Where(c => c.user == model.user && c.password == model.password && c.IsActive);
            if(admin.Any())
            {
                return true;
            }
            return false;
        }

    }
}