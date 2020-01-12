using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Post
{
    public partial interface IPostService
    {
        void Insert(Posts model);
        IList<Posts> GetAll();
        IList<Posts> GetAll(int excludeRecord, int pageSize);
        IList<Posts> GetLast(int nPost);
        Posts GetById(int id);
        void Update(int id, Posts model);
        void Delete(int id);
    }
}