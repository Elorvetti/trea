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

        public IList<PostDisplay> PostDisplays{ get; set; }

        public string categoryName { get; set; }
        public string argumentName { get; set; }

        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Post> posts { get; set; }
        public Category category { get; set; }
        public Argument argument { get; set; }
        public IList<Category> categories { get; set; }
        public IList<Argument> arguments { get; set; }
    }    

    public class PostsPath{
        public int categoryId { get; set; }
        public int argumentId { get; set; }
        public string name { get; set; }
        
    }

    public class PostDisplay{
        public int id { get; set; }
        public string slug { get; set; }
        public string coverImage{ get; set; }

        public string title { get; set; }

        public string testo { get; set; }
        
    }
}