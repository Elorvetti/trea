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
    public partial class PostService : IPostService
    {
        private readonly TreAContext _ctx;

        public PostService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Post post){
            _ctx.post.Add(post);
            _ctx.SaveChanges();
        }

        public virtual IList<Post> GetAll(){
            return _ctx.post.ToList();
        }

        public virtual IList<Post> GetAll(int excludeRecord, int pageSize){
            return _ctx.post.OrderBy(p => p.categoryId).ThenBy(p => p.argumentId).Skip(excludeRecord).Take(pageSize).ToList();
        }
        
        public virtual IList<Post> GetLast(int nPost){
            return _ctx.post.Where(p => p.pubblico == true).OrderByDescending(p => p.id).Take(nPost).ToList();
        }
        public virtual IList<PostsPath> GetAllPath(){
            var models = new List<PostsPath>();
            var categories = _ctx.category.ToList();

            foreach(var category in categories){
                models.Add(new PostsPath(){
                    categoryId = category.id,
                    name = category.name
                });
            };

            var arguments = _ctx.argument.Include(c => c.category).ToList();
            foreach(var argument in arguments){
                models.Add(new PostsPath(){
                    categoryId = argument.category.id,
                    argumentId = argument.id,
                    name = argument.category.name + " / " + argument.name,
                });
            };

            return models.OrderBy( p => p.name).ToList();
            
        }

        public Post GetById(int id){
            return _ctx.post.First(p => p.id == id);
        }

        public void Update(int id, Post model){
            var post = _ctx.post.Find(id);
            
            post.categoryId = model.categoryId;
            post.argumentId = model.argumentId;
            post.PhotoId = model.PhotoId;
            post.albumId = model.albumId;
            post.title = model.title;
            post.testo = model.testo;
            post.slug = model.slug;
            post.pubblico = model.pubblico;

            
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var post = _ctx.post.First(p => p.id == id);
            _ctx.post.Remove(post);
            _ctx.SaveChanges();
        }
    }
}