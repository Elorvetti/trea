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
    public partial class VideoService : IVideoService
    {
        private readonly TreAContext _ctx;

        public VideoService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Video model){
            _ctx.video.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Video> GetAll(){
            return _ctx.video.ToList();
        }

        public Video GetById(int id){
            return _ctx.video.First(v => v.id == id);
        }

        public void Update(int id, Video model){
            var video = _ctx.video.Find(id);
            video.name = model.name;
            video.path = model.path;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var video = _ctx.video.First(v => v.id == id);
            _ctx.video.Remove(video);
            _ctx.SaveChanges();
        }
    }
}