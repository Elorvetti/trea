using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Video
{
    public partial interface IVideoService
    {
        void Insert(Videos model);
        IList<Videos> GetAll();
        IList<Videos> GetAll(int excludeRecord, int pageSize);
        Videos GetById(int id);
        void Update(int id, Videos model);
        void Delete(int id);   
        IList<Videos> Find(string name, int excludeRecord, int pageSize);
    }
}