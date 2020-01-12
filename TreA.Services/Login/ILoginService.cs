using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Login
{
    public partial interface ILoginService
    {
        bool IsAdmin(Administrators adminUser);
    }
}