using System.Collections.Generic;
using TreA.Data.Entities;

namespace TreA.Presentation.Models
{
    public class PodcastModel : Podcasts
    {
        public IList<Podcasts> podcasts { get; set; } = new List<Podcasts>();
    }

}