using System;
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
        TreAContext _ctx;
        public LoginService(TreAContext ctx)
        {
            _ctx = ctx;
        }

        public virtual bool IsAdmin(AdministratorModel adminUser)
        {
            var admin = _ctx.Admins.Where(c => c.user == adminUser.email && c.password == adminUser.password );
            if(admin != null)
            {
                return true;
            }
            else {
                return false;
            }
        }
    }
}