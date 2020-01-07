using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface ICategoryService
    {
        void Insert(Category model);
        IList<Category> GetAll();
        IList<Category> GetAll(int excludeRecord, int pageSize);
        Category GetById(int id);
        void Update(int id, Category model);
        void Delete(int id);
    }
}