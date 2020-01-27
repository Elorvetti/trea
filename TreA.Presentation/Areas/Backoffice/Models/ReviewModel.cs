using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public partial class ReviewModel : Reviews
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public IList<DisplayReviews> displayReviews { get; set; } = new List<DisplayReviews>();
    }

    public class DisplayReviews{
        public int id { get; set; }
        public bool acepted { get; set; }
        public string email { get; set; }
        public string postTitle { get; set; }
        public string testo { get; set; }
    }
}