using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.User
{
    public partial interface IUserService
    {
        void Insert(Administrators model);
        IList<Administrators> GetAll();
        IList<Administrators> GetAll(int excludeRecord, int pageSize);
        Administrators GetById(int id);
        IList<Administrators> GetByPhotoId(int idPhoto);
        Administrators GetByEmail(string email);
        void Update(int id, Administrators model);
        void Delete(int id);
    }
}