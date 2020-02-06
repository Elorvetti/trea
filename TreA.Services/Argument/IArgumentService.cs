using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Argument
{
    public partial interface IArgumentService
    {
        void Insert(Arguments model);
        IList<Arguments> GetAll();
        IList<Arguments> GetAll(int excludeRecord, int pageSize);
        Arguments GetById(int id);
        Arguments GetBySlugId(int slugId);
        IList<Arguments> GetByCategoryId(int categoryId);
        IList<Arguments> GetByCategoryId(int categoryId, int livello, int idPadre);
        void Update(int id, Arguments model);
        void Delete(int id);
        IList<Arguments> Find(int idCategory, string name, int excludeRecord, int pageSize);
    }
}