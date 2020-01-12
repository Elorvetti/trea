using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class PostModel : Posts
    {
        public IList<PostsPath> PostsPath{ get; set; }
        public Albums album { get; set; }

        public IList<PostDisplay> PostDisplays{ get; set; }

        public string categoryName { get; set; }
        public string argumentName { get; set; }

        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Posts> posts { get; set; }
        public Categories category { get; set; }
        public Arguments argument { get; set; }
        public IList<Categories> categories { get; set; }
        public IList<Arguments> arguments { get; set; }
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