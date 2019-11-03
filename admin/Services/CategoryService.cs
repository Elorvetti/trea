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
    public partial class CategoryService : ICategoryService
    {
        private readonly TreAContext _ctx;

        public CategoryService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Category model){
            _ctx.category.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Category> GetAll(){
            return _ctx.category.ToList();
        }

        public virtual Category GetById(int id){
            return _ctx.category.First(a => a.id == id);
        }

        public void Update(int id, Category model){
            var category = _ctx.category.Find(id);
            category.name = model.name;
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