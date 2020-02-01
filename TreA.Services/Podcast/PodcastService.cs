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

namespace TreA.Services.Podcast
{
    public partial class PodcastService : IPodcastService
    {
        private readonly TreAContext _ctx;

        public PodcastService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Podcasts model){
            _ctx.podcast.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Podcasts> GetAll(){
            return _ctx.podcast.ToList();
        }

        public virtual IList<Podcasts> GetAll(int excludeRecord, int pageSize){
            return _ctx.podcast.Skip(excludeRecord).Take(pageSize).ToList();
        }
        public Podcasts GetById(int id){
            return _ctx.podcast.First(p => p.id == id);
        }

        public void Update(int id, Podcasts model){
            var podcast = _ctx.podcast.Find(id);
            podcast.name = model.name;
            podcast.path = model.path;
            podcast.description = model.description;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var podcast = _ctx.podcast.First(v => v.id == id);
            _ctx.podcast.Remove(podcast);
            _ctx.SaveChanges();
        }

        public virtual IList<Podcasts> Find(string name, int excludeRecord, int pageSize){         
            var podcasts = from p in _ctx.podcast where EF.Functions.Like(p.name, string.Concat("%", name, "%")) select p;
            return podcasts.Skip(excludeRecord).Take(pageSize).ToList();
        }
    }
}