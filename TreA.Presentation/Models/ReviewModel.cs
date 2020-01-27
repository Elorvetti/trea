using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public partial class ReviewModel : Reviews
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public IList<Reviews> reviews { get; set; } = new List<Reviews>();
    }
}