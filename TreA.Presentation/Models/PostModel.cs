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
        public IList<Posts> posts{ get; set; } = new List<Posts>();
        public IList<PostDisplayModel> postsDisplay { get; set; } = new List<PostDisplayModel>();
        public string categoryName { get; set; }
        public string argumentName{ get; set; }
        public IList<breadcrumbs> breadcrumb { get; set; } = new List<breadcrumbs>();
        public string coverImage{ get; set; }
        public IList<ArgumentDisplay> realtedPost { get; set; } = new List<ArgumentDisplay>();
        public IList<ArgumentDisplay> realtedArgument{ get; set; } = new List<ArgumentDisplay>();
        public ReviewModel reviewData{ get; set; } = new ReviewModel();
        public IList<string> album { get; set; } = new List<string>();
    }

    public class breadcrumbs{
        public string name { get; set; }
        public string slug { get; set; }
    }

    public class Album
    {
        public IList<string> imagePath { get; set; } = new List<string>();
        public IList<string> videoPath { get; set; } = new List<string>();
    }
    
}