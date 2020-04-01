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
 
 namespace TreA.Services.User
 {
     public partial class UserService : IUserService
     {
         private readonly TreAContext _ctx;

         public UserService(TreAContext ctx){
            this._ctx = ctx;
        }

         public void Insert(Administrators admin){
            _ctx.administrator.Add(admin);
            _ctx.SaveChanges(); 
        }

        public virtual IList<Administrators> GetAll(){
            return _ctx.administrator.ToList();
        }
        public virtual IList<Administrators> GetAll(int excludeRecord, int pageSize){
            return _ctx.administrator.Skip(excludeRecord).Take(pageSize).ToList();
        }

        public virtual IList<Administrators> GetByPhotoId(int photoId){
            return _ctx.administrator.Where(a => a.photoId == photoId).ToList();
        }

        public virtual Administrators GetById(int id){
        return  _ctx.administrator.First(u => u.id == id);
        }

        public virtual Administrators GetByEmail(string email){
            return _ctx.administrator.First(u => u.user == email);
        }

        public void Update(int id, Administrators model){
            var user = _ctx.administrator.Find(id);
            user.IsActive = model.IsActive;
            user.photoId = model.photoId;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var user = _ctx.administrator.First(u => u.id == id);
            _ctx.administrator.Remove(user);
            _ctx.SaveChanges();
        }

        public virtual IList<Administrators> Find(string email, string active, int excludeRecord, int pageSize){         
            IQueryable<Administrators> admins;
            
            if(!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(active)){
                admins = from a in _ctx.administrator where a.IsActive == true where EF.Functions.Like(a.user, string.Concat("%", email, "%")) select a;
            } else if(!string.IsNullOrEmpty(email) && string.IsNullOrEmpty(active)) {
                admins = from a in _ctx.administrator where EF.Functions.Like(a.user, string.Concat("%", email, "%")) select a;
            } else {
                admins = _ctx.administrator.Where(a => a.IsActive == true);
            }
            
            return admins.Skip(excludeRecord).Take(pageSize).ToList();
        }

     }
 }