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

namespace TreA.Services.PhotoFolder
{
    public partial class PhotoFolderService : IPhotoFolderService
    {
        private readonly TreAContext _ctx;

        public PhotoFolderService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(PhotoFolders model){
            _ctx.photoFolder.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<PhotoFolders> GetAll(){
            return _ctx.photoFolder.ToList();
        }

        public virtual PhotoFolders GetById(int id){
            return _ctx.photoFolder.First(a => a.id == id);
        }

        public void Update(int id, PhotoFolders model){
            var photoFolder = _ctx.photoFolder.Find(id);
            photoFolder.name = model.name;
            photoFolder.path = model.path;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var photoFolder = _ctx.photoFolder.First(c => c.id == id);
            _ctx.photoFolder.Remove(photoFolder);
            _ctx.SaveChanges();
        }

    }

}