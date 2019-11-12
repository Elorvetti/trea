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

        public void Insert(Post model){
            _ctx.post.Add(model);
            _ctx.SaveChanges();
        }

        public virtual IList<Post> GetAll(){
            return _ctx.post.ToList();
        }

        public Post GetById(int id){
            return _ctx.post.First(p => p.id == id);
        }

        public void Update(int id, Post model){
            var post = _ctx.post.Find(id);
            post.idArgument = model.idArgument;
            post.idTemplate = model.idTemplate;
            post.idAlbum = model.idAlbum;
            post.idImmagini = model.idImmagini;
            post.title = model.title;
            post.subtitle = model.subtitle;
            post.testo = model.testo;
            
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var post = _ctx.post.First(p => p.id == id);
            _ctx.post.Remove(post);
            _ctx.SaveChanges();
        }
    }
}