using System;
using System.Collections;
using System.Collections.Generic;
using admin.Models;
using admin.Data;
using Microsoft.AspNetCore.Hosting;

namespace  admin.Services
{
    public partial interface IFolderService
    {
        bool Exist(string folderName);
        void Create(string folderName);
        void Update(string folderName, string newFolderName);
        void Delete(string folderName);
        string removeSpaceAndSlash(string folderName);
        string formatPath(string folderName);
    }
}