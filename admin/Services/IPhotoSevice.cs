using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IPhotoService
    {
        void Insert(Photo model);
        IList<Photo> GetAll();
        IList<Photo> GetAll(int excludeRecord, int pageSize);
        Photo GetById(int id);
        void Update(int id, Photo model);
        void Delete(int id);
    }
}