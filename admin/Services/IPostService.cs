using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using admin.Models;
using admin.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace admin.Services
{
    public partial interface IPostService
    {
        void Insert(Post model);
        IList<Post> GetAll();
        Post GetById(int id);
        void Update(int id, Post model);
        void Delete(int id);

        IList<PostsPath> GetAllPath();
    }
}