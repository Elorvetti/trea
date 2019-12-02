using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using admin.Models;
using admin.Data;

namespace admin.Services
{
    public partial class CommonService : ICommonService
    {
        public string removeSpaceAndSlash (string name){
            return name.Replace(" ", "-").Replace("/", "-");
        }
    }
}