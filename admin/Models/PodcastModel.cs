using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using admin.Data;

namespace admin.Models
{
    public class PodcastModel : Podcast
    {
        public IList<IFormFile> podcasts { get; set; }
        public int pageSize { get; set; }
        public double pageTotal { get; set; }
        public bool displayPagination{ get; set; }
        public string sectionName { get; set; }
        public IList<Podcast> podcastList { get; set; }

    }
}