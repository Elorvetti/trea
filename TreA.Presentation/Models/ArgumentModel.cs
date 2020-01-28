using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class ArgumentModel : Arguments
    {
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public string slug { get; set; } 
        public IList<Arguments> arguments { get; set; }
        public IList<ArgumentDisplay> argumentsDisplay { get; set; } = new List<ArgumentDisplay>();
        public IList<Categories> categories{ get; set; }
    }

    public class ArgumentDisplay{
        public int id { get; set; }
        public string slug { get; set; }
        public string coverImage{ get; set; }
        public string title { get; set; }
        public string subtitle { get; set; }
        public int nOfElement { get; set; }
    }
}