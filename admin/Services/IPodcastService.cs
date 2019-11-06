using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IPodcastService
    {
        void Insert(Podcast model);
        IList<Podcast> GetAll();
        Podcast GetById(int id);
        void Update(int id, Podcast model);
        void Delete(int id);   
    }
}