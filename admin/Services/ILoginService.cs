using System;
using System.Collections.Generic;
using admin.Models;

namespace admin.Services
{
    public partial interface ILoginService
    {
        bool IsAdmin(AdministratorModel adminUser);
    }
}