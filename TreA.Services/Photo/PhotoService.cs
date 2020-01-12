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

namespace TreA.Services.Photo
{
    public partial class PhotoService: IPhotoService
    {
        private readonly TreAContext _ctx;

        public PhotoService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Photos model){
            _ctx.photo.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Photos> GetAll(){
            return _ctx.photo.ToList();
        }

        public virtual IList<Photos> GetAll(int excludeRecord, int pageSize){
            return _ctx.photo.Skip(excludeRecord).Take(pageSize).ToList();
        }

        public Photos GetById(int id){
            return _ctx.photo.First(p => p.id == id);
        }

        public void Update(int id, Photos model){
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