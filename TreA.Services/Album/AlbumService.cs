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

namespace TreA.Services.Album
{
    public partial class AlbumService : IAlbumService
    {
        private readonly TreAContext _ctx;

        public AlbumService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Albums model){
            _ctx.album.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Albums> GetAll(){
            return _ctx.album.ToList();
        }

        public virtual Albums GetById(int id){
            return _ctx.album.FirstOrDefault(a => a.id == id);
        }

        public int GetLast(){
            return _ctx.album.OrderByDescending(a => a.id).FirstOrDefault().id;
        }
        public void Update(int id, Albums model){
            var album = _ctx.album.Find(id);
            album.idImmagini = model.idImmagini;
            album.idVideo = model.idVideo;
            
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var album = _ctx.album.First(a => a.id == id);
            _ctx.album.Remove(album);

            _ctx.SaveChanges();
        }

    }
}