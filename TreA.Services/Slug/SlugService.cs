using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Slug
{
    public partial class SlugService : ISlugService
    {
        private readonly TreAContext _ctx;

        public SlugService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Slugs slug){
            _ctx.slug.Add(slug);
            _ctx.SaveChanges();
        }

        public virtual IList<Slugs> GetAll(){
            return _ctx.slug.ToList();
        }

        public Slugs GetByName(string name){
            return _ctx.slug.FirstOrDefault(s => s.name == name);
        }

        public Slugs GetById(int id){
            return _ctx.slug.Find(id);
        }

        public void Update(int id, string name){
            var slug = _ctx.slug.Find(id);
            slug.name = name;

            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var slug = _ctx.slug.First(s => s.id == id);
            _ctx.slug.Remove(slug);
            _ctx.SaveChanges();
        }
    }
}