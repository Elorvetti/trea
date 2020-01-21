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
        IList<Reviews> GetByPostId(int postId);
        IList<Reviews> GetByPostId(int postId, int excludeRecord, int pageSize);

    }
}