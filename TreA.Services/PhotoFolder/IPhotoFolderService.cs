using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.PhotoFolder
{
    public partial interface IPhotoFolderService
    {
        void Insert(PhotoFolders model);
        IList<PhotoFolders> GetAll();
        PhotoFolders GetById(int id);
        void Update(int id, PhotoFolders model);
        void Delete(int id);
    }
}