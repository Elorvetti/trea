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

namespace TreA.Services.Home
{
    public partial class HomeService : IHomeService
    {
        private readonly TreAContext _ctx;

        public HomeService(TreAContext ctx){
            this._ctx = ctx;
        }

        public void Insert(Homes model){
            if(!_ctx.home.Any()){
                _ctx.home.Add(model);
            } else {
                var home = _ctx.home.FirstOrDefault();
            
                home.headerTitolo = model.headerTitolo;
                home.headerTesto = model.headerTesto;
                home.headerImageId = model.headerImageId;
                home.newsletterImageId = model.newsletterImageId;
            }
            _ctx.SaveChanges();
        }

        public virtual Homes GetSetting(){
            return _ctx.home.FirstOrDefault();
        }

        public void Update(Homes model){
            var home = _ctx.home.FirstOrDefault();
            
            home.headerTitolo = model.headerTitolo;
            home.headerTesto = model.headerTesto;
            home.headerImageId = model.headerImageId;
            home.newsletterImageId = model.newsletterImageId;

            _ctx.SaveChanges();
        }

        public void UpdateImageOnDelete(int headerImageId, int newsletterImageId){
            var home = _ctx.home.FirstOrDefault();

            home.headerImageId = headerImageId;
            home.newsletterImageId = newsletterImageId;

            _ctx.SaveChanges();
        }
    }
}