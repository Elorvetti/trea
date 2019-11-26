using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using admin.Data;

namespace admin.Models
{
    public class PostModel : Post
    {
        public IList<PostsPath> PostsPath{ get; set; }
        public Album album { get; set; }
    }    


    public class PostsPath{
        public int id { get; set; }
        public string name { get; set; }
        
        public bool isChild { get; set; }
        
    }
}