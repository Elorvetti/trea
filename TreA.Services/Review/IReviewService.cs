using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Review
{
    public partial interface IReviewService
    {
        void Insert(Reviews model);
        IList<Reviews> GetAll();
        IList<Reviews> GetAll(int excludeRecord, int pageSize);
        IList<Reviews> GetAcepted(int excludeRecord, int pageSize);
        Reviews GetById(int id);
        IList<Reviews> GetByPostId(int postId);
        IList<Reviews> GetByPostId(int postId, int excludeRecord, int pageSize);
        void Update(int id, Reviews model);
        void Delete(int id);
    }
}