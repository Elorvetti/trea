using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IAlbumService
    {
        void Insert(Album model);
        IList<Album> GetAll();
        Album GetById(int id);

        int GetLast();
        void Update(int id, Album model);
        void Delete(int id);
    }
}