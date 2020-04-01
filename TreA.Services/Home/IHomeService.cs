using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Home
{
    public partial interface IHomeService 
    {
        void Insert(Homes model);
        Homes GetSetting();
        void Update(Homes model);
        Homes GetImageUsage(int id);
    }
}