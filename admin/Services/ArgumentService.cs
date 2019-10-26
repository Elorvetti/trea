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
    public partial class ArgumentService : IArgumentService
    {
        private readonly TreAContext _ctx;

        public ArgumentService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Argument folder){
            _ctx.argument.Add(folder);
            _ctx.SaveChanges();
        }

        public virtual IList<Argument> GetAll(){
            return _ctx.argument.ToList();
        }

        public virtual Argument GetById(int id){
            return _ctx.argument.First(a => a.id == id);
        }

        public void Update(int id, Argument folder){
            var argument = _ctx.argument.Find(id);
            argument.path = folder.path;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var argument = _ctx.argument.First(a => a.id == id);
            _ctx.argument.Remove(argument);
            _ctx.SaveChanges();
        }

    }
}