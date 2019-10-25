using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IUserService
    {
        void InsertUser(Administrator model);
        IList<Administrator> GetAllUser();
        Administrator GetUserById(int id);
        void UpdateUser(int id, Administrator model);
        void DeleteUser(int id);
    }
}