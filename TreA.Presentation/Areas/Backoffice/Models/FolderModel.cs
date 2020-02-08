using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using TreA.Data.Entities;

namespace TreA.Presentation.Areas.Backoffice.Models
{
    public class FolderModel : PhotoFolders
    {
        public IList<PhotoFolders> folders { get; set; } = new List<PhotoFolders>();
    }
}