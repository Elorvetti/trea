using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Slug
{
    public partial interface ISlugService
    {
        void Insert(Slugs slugs);
        IList<Slugs> GetAll();
        Slugs GetByName(string name);
        Slugs GetById(int id);
        void Update(int id, string name);
        void Delete(int id);
    }
}