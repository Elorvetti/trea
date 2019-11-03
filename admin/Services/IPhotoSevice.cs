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
        Photo GetById(int id);
        void Update(int id, Photo model);
        void Delete(int id);
    }
}