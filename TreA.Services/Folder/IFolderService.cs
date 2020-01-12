using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;
using Microsoft.AspNetCore.Hosting;

namespace  TreA.Services.Folder
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