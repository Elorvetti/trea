using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Album
{
    public partial interface IAlbumService
    {
        void Insert(Albums model);
        IList<Albums> GetAll();
        Albums GetById(int id);
        int GetLast();
        void Update(int id, Albums model);
        void Delete(int id);
    }
}