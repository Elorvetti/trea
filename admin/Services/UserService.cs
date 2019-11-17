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
     public partial class UserService : IUserService
     {
         private readonly TreAContext _ctx;

         public UserService(TreAContext ctx){
             this._ctx = ctx;
         }

         public void Insert(Administrator admin){
            _ctx.administrator.Add(admin);
            _ctx.SaveChanges(); 
         }

         public virtual IList<Administrator> GetAll(){
            return _ctx.administrator.ToList();
         }

        public virtual IList<Administrator>GetByPhotoId(int photoId)
        {
            return _ctx.administrator.Where(a => a.photoId == photoId).ToList();
        }

         public virtual Administrator GetById(int id){
            return  _ctx.administrator.First(u => u.id == id);
         }

        public virtual Administrator GetByEmail(string email){
            return _ctx.administrator.First(u => u.user == email);
        }

        public void Update(int id, Administrator model){
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
     }
 }