using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface ILoginService
    {
        bool IsAdmin(AdministratorModel adminUser);
    }
}