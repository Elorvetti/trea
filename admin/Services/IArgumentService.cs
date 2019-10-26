using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IArgumentService
    {
        void Insert(Argument model);
        IList<Argument> GetAll();
        Argument GetById(int id);
        void Update(int id, Argument model);
        void Delete(int id);
    }
}