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
     }
 }