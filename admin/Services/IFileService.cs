using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;
using Microsoft.AspNetCore.Hosting;

namespace admin.Services
{
    public partial interface IFileService
    {
        bool fileExtensionOk(string fileExtension, string[] extensioneSupported);
    }
}