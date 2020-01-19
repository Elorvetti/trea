using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class PostModel : Posts
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public string slug { get; set; } 
        public IList<Posts> posts{ get; set; }
        public IList<PostDisplayModel> postsDisplay { get; set; } = new List<PostDisplayModel>();
        public string categoryName { get; set; }
        public string argumentName{ get; set; }
        
        public Albums album { get; set; } = new Albums();
    }
    
}