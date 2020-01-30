using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Category
{
    public partial interface ICategoryService
    {
        void Insert(Categories model);
        IList<Categories> GetAll();
        IList<Categories> GetAll(int excludeRecord, int pageSize);
        Categories GetById(int id);
        Categories GetBySlugId(int slugId);
        void Update(int id, Categories model);
        void Delete(int id);
        IList<Categories> Find(string name, int excludeRecord, int pageSize);
    }
}