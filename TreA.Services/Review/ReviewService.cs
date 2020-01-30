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


namespace TreA.Services.Review
{
    public partial class ReviewService : IReviewService
    {
        private readonly TreAContext _ctx;

        public ReviewService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Reviews review){
            _ctx.review.Add(review);
            _ctx.SaveChanges();
        }

        public IList<Reviews> GetAll(){
            return _ctx.review.ToList();
        }

        public IList<Reviews> GetAll(int excludeRecord, int pageSize){
            return _ctx.review.OrderBy(r => r.insertDate).Skip(excludeRecord).Take(pageSize).ToList();
        }

        public IList<Reviews> GetAcepted(int excludeRecord, int pageSize){
            return _ctx.review.Where(r => r.acepted == true).OrderBy(r => r.insertDate).Skip(excludeRecord).Take(pageSize).ToList();
        }
        
        public Reviews GetById(int id){
            return _ctx.review.Find(id);
        }


        public IList<Reviews> GetByPostId(int postId){
            return _ctx.review.Where(r => r.postId == postId && r.acepted == true).ToList();
        }

        public IList<Reviews> GetByPostId(int postId, int excludeRecord, int pageSize){
            return _ctx.review.Where(r => r.postId == postId && r.acepted == true).OrderBy(r => r.insertDate).Skip(excludeRecord).Take(pageSize).ToList();
        }

        public void Update(int id, Reviews model){
            var review = _ctx.review.FirstOrDefault(r => r.id == id);
            review.acepted = model.acepted;
            _ctx.SaveChanges();
        }

        public void Delete(int id){
            var review = _ctx.review.First(r => r.id == id);
            _ctx.review.Remove(review);
            _ctx.SaveChanges();
        }

        public virtual IList<Reviews> Find(string email, string acepted, int excludeRecord, int pageSize){         
            IQueryable<Reviews> reviews;
            
            if(!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(acepted)){
                reviews = from r in _ctx.review where r.acepted == true where EF.Functions.Like(r.email, string.Concat("%", email, "%")) select r;
            } else if(!string.IsNullOrEmpty(email) && string.IsNullOrEmpty(acepted)) {
                reviews = from r in _ctx.review where EF.Functions.Like(r.email, string.Concat("%", email, "%")) select r;
            } else {
                reviews = _ctx.review.Where(r => r.acepted == true);
            }
            
            return reviews.Skip(excludeRecord).Take(pageSize).ToList();
        }
    }
}