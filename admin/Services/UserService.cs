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

         public void InsertUser(Administrator admin){
            _ctx.administrator.Add(admin);
            _ctx.SaveChanges(); 
         }

         public virtual IList<Administrator> GetAllUser(){
            return _ctx.administrator.ToList();
         }

         public virtual Administrator GetUserById(int id){
            return  _ctx.administrator.First(u => u.id == id);
         }

         public void UpdateUser(int id, Administrator model){
             var user = _ctx.administrator.Find(id);
             user.IsActive = model.IsActive;
             _ctx.SaveChanges();
         }
     }
 }