using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using TreA.Presentation.Areas.Backoffice.Models;
using TreA.Data.Entities;
using TreA.Services.Common;
using TreA.Services.Review;
using TreA.Services.Post;

namespace TreA.Presentation.Areas.Backoffice.Controllers
{
    [Area("Backoffice")]
    public partial class ReviewController : Controller
    {
        private readonly IReviewService _reviewService;
        private readonly IPostService _postService;

        public ReviewController(IReviewService reviewService, IPostService postService){
            this._reviewService = reviewService;
            this._postService = postService;
        }

        public IActionResult Index(){
            ViewBag.Title = "Commenti";

            return View();
        }

        [HttpPost]
        public ReviewModel GetAll(int pageSize, int pageNumber){
            var model = new ReviewModel();
            
            var excludeRecords = (pageSize * pageNumber) - pageSize;
            var total = _reviewService.GetAll().Count;

            model.pageSize = pageSize;
            model.pageTotal =  Math.Ceiling((double)total / pageSize);
            var reviews = _reviewService.GetAll(excludeRecords, pageSize);

            foreach(var review in reviews){
                model.displayReviews.Add(new DisplayReviews(){
                    id = review.id,
                    acepted = review.acepted,
                    email = review.email,
                    postTitle = _postService.GetById(review.postId).title,
                    testo = review.testo
                });
            }

            if(model.pageTotal > 1){
                model.displayPagination = true;
            } else {
                model.displayPagination = false;
            }
            
            return model;
        }

        public DisplayReviews GetById(int id){
            var model = new DisplayReviews();

            var review = _reviewService.GetById(id);
          
            model.id = review.id;
            model.postTitle = _postService.GetById(review.postId).title;
            model.acepted = review.acepted;
            model.email = review.email;
            model.testo = review.testo;

            return model;
        }

        [HttpPost]
        public void Update(int id, IFormCollection review){
            var model = new Reviews();
            
            var acepted = review["acepted"];
            if(acepted == "on"){
                model.acepted = true;
            } else{
                model.acepted = false;
            }

            _reviewService.Update(id, model);
        }

        [HttpPost]
        public void Delete(int id){
            _reviewService.Delete(id);
        }
    }
}