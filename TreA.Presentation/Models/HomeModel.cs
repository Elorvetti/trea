using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class HomeModel : Homes
    {
        public string headerBackgroundImage { get; set; }
        public IList<PostDisplayModel> PostDisplays{ get; set; } = new List<PostDisplayModel>();
        public NewsletterModel Newsletter{ get; set; } = new NewsletterModel();
        public IList<PodcastModel> podcasts { get; set; } = new List<PodcastModel>();
public IList<CategoryMenu> categoryMenus{ get; set; } = new List<CategoryMenu>();
        public IList<ArgumentMenu> argumentMenus { get; set; } = new List<ArgumentMenu>();
    }

    public class CategoryMenu : Categories{
        public bool HasChild{ get; set; }
        public string slug{ get; set; }
    }

    public class ArgumentMenu : Arguments{
        public bool HasChild{ get; set; }
        public string slug{ get; set; }
    }

}