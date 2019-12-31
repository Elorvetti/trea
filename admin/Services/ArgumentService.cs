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

        public void Insert(Argument argument){
            _ctx.argument.Add(argument);
            _ctx.SaveChanges();
        }

        public virtual IList<Argument> GetAll(){
            return _ctx.argument.Include(c => c.category).ToList();

        }
        
        public virtual Argument GetById(int id){
            return _ctx.argument.First(a => a.id == id);
        }

        public void Update(int id, Argument model){
            var argument = _ctx.argument.Find(id);
            
            argument.name = model.name;
            argument.categoryId = model.categoryId;
            argument.description = model.description;
            argument.slug = model.slug;
            
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var argument = _ctx.argument.First(a => a.id == id);
            _ctx.argument.Remove(argument);
            _ctx.SaveChanges();
        }

        public virtual IList<categories> GetAllCategory(){
            var models = new List<categories>();
            var categories = _ctx.category.ToList();

            foreach(var category in categories){
                models.Add(new categories(){
                    id = category.id,
                    name = category.name
                });
            }

            return models.ToList();
        }
    }
}