using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class HomeModel : Homes
    {
        public string headerBackgroundImage { get; set; }
         public IList<PostDisplayModel> PostDisplays{ get; set; }
         public NewsletterModel Newsletter{ get; set; }
    }

}