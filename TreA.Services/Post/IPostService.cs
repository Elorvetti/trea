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
        Posts GetBySlugId(int slugId);
        IList<Posts> GetByCategoryId(int categoryId);
        IList<Posts> GetByArgumentId(int argumentId);
        IList<Posts> Search(string value);
        void Update(int id, Posts name);
        void Delete(int id);
        IList<Posts> Find(int categoryId, int argumentId, string title, string IsPublic, int excludeRecord, int pageSize);
    }
}