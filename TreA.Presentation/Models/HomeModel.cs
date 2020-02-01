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

    }

}