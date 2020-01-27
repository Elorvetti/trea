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

namespace TreA.Services.Post
{
    public partial class PostService : IPostService
    {
        private readonly TreAContext _ctx;

        public PostService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Posts post){
            _ctx.post.Add(post);
            _ctx.SaveChanges();
        }

        public virtual IList<Posts> GetAll(){
            return _ctx.post.ToList();
        }

        public virtual IList<Posts> GetAll(int excludeRecord, int pageSize){
            return _ctx.post.OrderBy(p => p.categoryId).ThenBy(p => p.argumentId).Skip(excludeRecord).Take(pageSize).ToList();
        }
        
        public virtual IList<Posts> GetLast(int nPost){
            return _ctx.post.Where(p => p.pubblico == true).OrderByDescending(p => p.id).Take(nPost).ToList();
        }

        public Posts GetById(int id){
            return _ctx.post.First(p => p.id == id);
        }

        public virtual Posts GetBySlugId(int slugId){
            return _ctx.post.First(p => p.slugId == slugId);
        }
        public virtual IList<Posts> GetByCategoryId(int categoryId){
            return _ctx.post.Where(p => p.categoryId == categoryId && p.pubblico == true).ToList();
        }

        public virtual IList<Posts> GetByArgumentId(int argumentId){
            return _ctx.post.Where(p => p.argumentId == argumentId && p.pubblico == true).ToList();
        }

        public virtual IList<Posts> Search(string value){
            var posts = from p in _ctx.post where EF.Functions.Like(p.title, string.Concat("%", value, "%")) select p;
            return posts.ToList();
        }

        public void Update(int id, Posts model){
            var post = _ctx.post.Find(id);
            
            post.categoryId = model.categoryId;
            post.argumentId = model.argumentId;
            post.PhotoId = model.PhotoId;
            post.albumId = model.albumId;
            post.title = model.title;
            post.testo = model.testo;
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