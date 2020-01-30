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

namespace TreA.Services.Video
{
    public partial class VideoService : IVideoService
    {
        private readonly TreAContext _ctx;

        public VideoService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Videos model){
            _ctx.video.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Videos> GetAll(){
            return _ctx.video.ToList();
        }

        public virtual IList<Videos> GetAll(int excludeRecord, int pageSize){
            return _ctx.video.Skip(excludeRecord).Take(pageSize).ToList();
        }
        

        public Videos GetById(int id){
            return _ctx.video.First(v => v.id == id);
        }

        public void Update(int id, Videos model){
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

        public virtual IList<Videos> Find(string name, int excludeRecord, int pageSize){         
            var videos = from v in _ctx.video where EF.Functions.Like(v.name, string.Concat("%", name, "%")) select v;
            return videos.Skip(excludeRecord).Take(pageSize).ToList();
        }
    }
}