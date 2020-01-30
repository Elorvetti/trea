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

namespace TreA.Services.Argument
{
    public partial class ArgumentService : IArgumentService
    {
        private readonly TreAContext _ctx;

        public ArgumentService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Arguments argument){
            _ctx.argument.Add(argument);
            _ctx.SaveChanges();
        }

        public virtual IList<Arguments> GetAll(){
            return _ctx.argument.Include(c => c.category).ToList();
        }
        
        public virtual IList<Arguments> GetAll(int excludeRecord, int pageSize){
            return _ctx.argument.Skip(excludeRecord).Take(pageSize).ToList();
        }
        public virtual Arguments GetById(int id){
            return _ctx.argument.FirstOrDefault(a => a.id == id);
        }

        public virtual Arguments GetBySlugId(int slugId){
            return _ctx.argument.First(c => c.slugId == slugId);
        }

        public virtual IList<Arguments> GetByCategoryId(int categoryId){
            return _ctx.argument.Where(a => a.categoryId == categoryId).ToList();
        }

        public void Update(int id, Arguments model){
            var argument = _ctx.argument.Find(id);
            
            argument.name = model.name;
            argument.categoryId = model.categoryId;
            argument.description = model.description;
            argument.coverImageId = model.coverImageId;
            
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var argument = _ctx.argument.First(a => a.id == id);
            _ctx.argument.Remove(argument);
            _ctx.SaveChanges();
        }

        public virtual IList<Arguments> Find(int idCategory, string name, int excludeRecord, int pageSize){         
            IQueryable<Arguments> arguments;
            
            if(!string.IsNullOrEmpty(name)){
                arguments = from a in _ctx.argument where a.categoryId == idCategory where EF.Functions.Like(a.name, string.Concat("%", name, "%")) select a;
            } else if(idCategory > 0) {
                arguments = _ctx.argument.Where(a => a.categoryId == idCategory);
            } else {
                arguments = _ctx.argument;
            }
            
            return arguments.Skip(excludeRecord).Take(pageSize).ToList();
        }
    }
}