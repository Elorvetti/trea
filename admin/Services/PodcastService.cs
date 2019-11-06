using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial class PodcastService : IPodcastService
    {
        private readonly TreAContext _ctx;

        public PodcastService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Podcast model){
            _ctx.podcast.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Podcast> GetAll(){
            return _ctx.podcast.ToList();
        }

        public Podcast GetById(int id){
            return _ctx.podcast.First(p => p.id == id);
        }

        public void Update(int id, Podcast model){
            var podcast = _ctx.podcast.Find(id);
            podcast.name = model.name;
            podcast.path = model.path;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var podcast = _ctx.podcast.First(v => v.id == id);
            _ctx.podcast.Remove(podcast);
            _ctx.SaveChanges();
        }
    }
}