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
    public partial class PhotoService: IPhotoService
    {
        private readonly TreAContext _ctx;

        public PhotoService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Photo model){
            _ctx.photo.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Photo> GetAll(){
            return _ctx.photo.ToList();
        }

        public Photo GetById(int id){
            return _ctx.photo.First(p => p.id == id);
        }

        public void Update(int id, Photo model){
            var photo = _ctx.photo.Find(id);
            photo.name = model.name;
            photo.path = model.path;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var photo = _ctx.photo.First(p => p.id == id);
            _ctx.photo.Remove(photo);
            _ctx.SaveChanges();
        }
    }
}