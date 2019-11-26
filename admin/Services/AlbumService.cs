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
    public partial class AlbumService : IAlbumService
    {
        private readonly TreAContext _ctx;

        public AlbumService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Album model){
            _ctx.album.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Album> GetAll(){
            return _ctx.album.ToList();
        }

        public virtual Album GetById(int id){
            return _ctx.album.First(a => a.id == id);
        }

        public int GetLast(){
            return _ctx.album.OrderByDescending(a => a.id).FirstOrDefault().id;
        }
        public void Update(int id, Album model){
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