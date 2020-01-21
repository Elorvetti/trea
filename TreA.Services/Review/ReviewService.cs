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

        public IList<Reviews> GetByPostId(int postId){
            return _ctx.review.Where(r => r.postId == postId).ToList();
        }

        public IList<Reviews> GetByPostId(int postId, int excludeRecord, int pageSize){
            return _ctx.review.Where(r => r.postId == postId).OrderBy(r => r.insertDate).Skip(excludeRecord).Take(pageSize).ToList();
        }
    }
}