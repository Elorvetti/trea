using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial interface IVideoService
    {
        void Insert(Video model);
        IList<Video> GetAll();
        IList<Video> GetAll(int excludeRecord, int pageSize);
        Video GetById(int id);
        void Update(int id, Video model);
        void Delete(int id);   
    }
}