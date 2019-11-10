using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IUserService
    {
        void Insert(Administrator model);
        IList<Administrator> GetAll();
        Administrator GetById(int id);
        Administrator GetByEmail(string email);
        void Update(int id, Administrator model);
        void Delete(int id);
    }
}