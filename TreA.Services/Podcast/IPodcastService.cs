using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Podcast
{
    public partial interface IPodcastService
    {
        void Insert(Podcasts model);
        IList<Podcasts> GetAll();
        IList<Podcasts> GetAll(int excludeRecord, int pageSize);
        Podcasts GetById(int id);
        void Update(int id, Podcasts model);
        void Delete(int id);   
        IList<Podcasts> Find(string name, int excludeRecord, int pageSize);
    }
}