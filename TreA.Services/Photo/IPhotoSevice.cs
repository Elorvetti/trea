using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Photo
{
    public partial interface IPhotoService
    {
        void Insert(Photos model);
        IList<Photos> GetAll();
        IList<Photos> GetAll(int excludeRecord, int pageSize);
        Photos GetById(int id);
        IList<Photos> GetByFolderId(int id);
        void Update(int id, Photos model);
        void Delete(int id);
        IList<Photos> Find(string name, int excludeRecord, int pageSize);
    }
}