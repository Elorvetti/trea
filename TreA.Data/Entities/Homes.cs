using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TreA.Data.Entities
{
    public partial class Homes
    {
        public int id { get; set; }
        public string headerTitolo { get; set; }

        public string headerTesto { get; set; }

        public int headerImageId { get; set; }

        public int newsletterImageId { get; set; }
    }
}