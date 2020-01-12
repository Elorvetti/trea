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

namespace TreA.Services.Category
{
    public partial class CategoryService : ICategoryService
    {
        private readonly TreAContext _ctx;

        public CategoryService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Categories model){
            _ctx.category.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Categories> GetAll(){
            return _ctx.category.ToList();
        }

        public virtual IList<Categories> GetAll(int excludeRecord, int pageSize){
            return _ctx.category.OrderBy(a => a.displayOrder).Skip(excludeRecord).Take(pageSize).ToList();
        }
        public virtual Categories GetById(int id){
            return _ctx.category.First(a => a.id == id);
        }

        public void Update(int id, Categories model){
            var category = _ctx.category.Find(id);
            category.name = model.name;
            category.slug = model.slug;
            category.description = model.description;
            category.displayOrder = model.displayOrder;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var category = _ctx.category.First(c => c.id == id);
            _ctx.category.Remove(category);
            _ctx.SaveChanges();
        }
    }

}