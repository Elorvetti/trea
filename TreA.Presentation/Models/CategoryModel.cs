using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class CategoryModel: Categories
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public string slug { get; set; }
        public IList<ArgumentChild> Children { get; set; } = new List<ArgumentChild>();
    }

    public class ArgumentChild : Arguments{
        public string slug{ get; set; }
    }
}